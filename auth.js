(() => {
  'use strict';
  const supabase = window.MBA_SUPABASE;
  let authGeneration = 0;
  const errorBox = document.getElementById('login-error');
  const authLog = (message, details) => {
    if (details === undefined) console.info(`[AUTH] ${message}`);
    else console.info(`[AUTH] ${message}`, details);
  };
  const authError = (message, error) => console.error(`[AUTH] ${message}`, error);
  const showError = (message) => { if (errorBox) { errorBox.textContent = message; errorBox.style.display = 'block'; } };
  const clearError = () => { if (errorBox) errorBox.style.display = 'none'; };
  const setAuthState = (signedIn) => { document.body.classList.remove('auth-loading','auth-signed-in','auth-signed-out'); document.body.classList.add(signedIn ? 'auth-signed-in' : 'auth-signed-out'); };

  function applyUser(user) {
    if (!user?.id || !user?.email || typeof user.permissions !== 'object') throw new Error('O perfil autenticado retornado pelo Supabase é inválido.');
    const name=user.name||user.nome||user.email.split('@')[0], firstName=name.trim().split(/\s+/)[0];
    const initials=name.trim().split(/\s+/).slice(0,2).map((part)=>part[0]?.toUpperCase()).join('')||'U';
    const roleLabels={admin:'Administrador',gestor:'Gestor',user:'Usuário',task_only:'Task only',task_worker:'Operacional'};
    document.getElementById('profile-name').textContent=name; document.getElementById('profile-role').textContent=roleLabels[user.role]||user.role;
    document.getElementById('profile-avatar').textContent=initials; document.getElementById('welcome-name').textContent=firstName;
    document.querySelectorAll('[data-permission]').forEach((element)=>{element.hidden=user.permissions[element.dataset.permission]!==true;});
    document.querySelectorAll('.master-admin-only').forEach((element)=>{element.hidden=!user.is_master_admin;});
    const pages=[['dashboard','dashboard.view'],['automacoes','automations.view'],['tutelas','tutelas.view'],['encerramentos','encerramentos.view'],['usuarios','users.view'],['configuracoes','settings.view'],['tarefas','tasks.view'],['pagamentos','pagamentos.view'],['acordos','agreements.view']].filter(([,permission])=>user.permissions[permission]===true);
    const active=document.querySelector('.page.active');
    if(!pages.length) window.showPage?.('sem-acesso'); else if(['task_only','task_worker'].includes(user.role)) window.showPage?.('tarefas'); else if(active?.dataset.permission&&user.permissions[active.dataset.permission]!==true) window.showPage?.(pages[0][0]);
    window.dispatchEvent(new CustomEvent('mba:authenticated',{detail:user}));
    if(!['task_only','task_worker'].includes(user.role)) window.restorePageRoute?.();
  }

  async function loadAdministrativeProfile(session) {
    const generation=++authGeneration;
    if(!session){setAuthState(false);return;}
    authLog('validando perfil');
    const {data,error}=await supabase.rpc('frontend_me');
    if(generation!==authGeneration)return;
    if(error)throw error;
    if(!data?.id||!data.active){await supabase.auth.signOut();setAuthState(false);showError('Sua conta Google não está cadastrada ou está inativa no Backoffice.');return;}
    applyUser(data);setAuthState(true);clearError();authLog('acesso autorizado');
  }

  async function initializeAuth() {
    window.localStorage.removeItem('mba_temp_access');
    window.localStorage.removeItem('mba_temp_email');
    window.sessionStorage.removeItem('mba_task_worker_token');
    if(window.MBA_LOCAL_PREVIEW){
      document.getElementById('local-preview-badge').hidden=false;
      applyUser({id:'00000000-0000-0000-0000-000000000001',name:'Gabriel Portilho',email:'gabriel.portilho@mascarenhasbarbosa.com.br',role:'admin',active:true,is_master_admin:true,permissions:Object.fromEntries([...document.querySelectorAll('[data-permission]')].map((element)=>[element.dataset.permission,true]))});
      const previewIndicators=[['42','+12 hoje'],['7','16,7% das análises'],['18','R$ 45,8 mil'],['31','96,9% concluídos']];
      document.querySelectorAll('.indicator-grid .indicator').forEach((card,index)=>{const value=previewIndicators[index];if(!value)return;card.querySelector('strong').textContent=value[0];card.querySelector('em').textContent=value[1];});
      setAuthState(true);
      if(!location.hash)window.showPage?.('dashboard',false);
      return;
    }
    if(!supabase){setAuthState(false);showError(window.MBA_SUPABASE_ERROR||'Supabase não configurado.');return;}
    try{authLog('verificando sessão');const {data,error}=await supabase.auth.getSession();if(error)throw error;if(data.session)authLog('sessão encontrada');await loadAdministrativeProfile(data.session);}catch(error){authError('erro ao verificar sessão',error);setAuthState(false);showError(error.message||'Não foi possível validar a sessão.');}
  }

  document.getElementById('google-login')?.addEventListener('click',async()=>{
    clearError();
    authLog('botão Google clicado');
    if(!supabase)return showError(window.MBA_SUPABASE_ERROR||'Supabase não configurado.');
    try{
      authLog('iniciando signInWithOAuth');
      const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${location.origin}${location.pathname}`}});
      if(error)throw error;
      authLog('OAuth iniciado');
    }catch(error){authError('erro ao iniciar Google OAuth',error);showError(error.message||'Não foi possível iniciar o login com Google.');}
  });
  document.getElementById('logout-button')?.addEventListener('click',async()=>{if(window.MBA_LOCAL_PREVIEW)return;authGeneration+=1;await supabase?.auth.signOut();location.assign('/');});
  supabase?.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED')setTimeout(()=>{if(session)authLog('sessão encontrada');loadAdministrativeProfile(session).catch((error)=>{authError('erro ao validar perfil',error);setAuthState(false);showError(error.message);});},0);if(event==='SIGNED_OUT'){authGeneration+=1;setAuthState(false);}});
  initializeAuth();
})();
