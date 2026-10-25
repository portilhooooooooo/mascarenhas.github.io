import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

// Um rascunho por usuário/carteira/tarefa/processo, restrito à aba atual.
// Nenhuma resposta em cache é enviada à API antes de "Salvar e próximo".
function read(key: string): Record<string, unknown> {
  if (!key) return {};
  try {
    let raw = sessionStorage.getItem(key);
    // This hook is mounted only after the scoped task/process API authorizes the
    // renderer. Legacy drafts have no wallet: never hydrate them during bootstrap.
    const prefix = draftPrefix();
    if (raw === null && prefix && key.startsWith(prefix)) {
      const parts=key.split(':');
      if(parts.length===5){
        const legacy='mba-qa-v1:'+parts[1]+':'+parts[3]+':'+parts[4];
        const old=sessionStorage.getItem(legacy);
        if(old!==null){
          const parsed:unknown=JSON.parse(old);
          if(parsed && typeof parsed==='object' && !Array.isArray(parsed)){
            raw=old;
            // Remove only after a durable replacement, so quota failure loses no work.
            try{sessionStorage.setItem(key,old);sessionStorage.removeItem(legacy);}catch{}
          }
        }
      }
    }
    const data: unknown = raw ? JSON.parse(raw) : {};
    return data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export function useQaField<T>(key: string, field: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const cached = read(key);
    return Object.prototype.hasOwnProperty.call(cached, field) ? cached[field] as T : initial;
  });
  useEffect(() => {
    if (!key) return;
    try {
      sessionStorage.setItem(key, JSON.stringify({ ...read(key), [field]: value }));
    } catch {
      // Quota ou armazenamento privado: o React mantém o rascunho em memória.
    }
  }, [key, field, value]);
  return [value, setValue];
}

export function clearQaDraft(key: string) {
  if (!key) return;
  try { sessionStorage.removeItem(key); } catch { /* armazenamento indisponível */ }
}

// Draft lifetime follows business access, rather than an API/schema version.
function draftContext(){
 const env=window as Window & {MBA_CURRENT_USER?:{id?:string;role?:string;is_master_admin?:boolean;access_kind?:string;permissions?:Record<string,boolean>};MBA_API?:{getPortfolioId?:()=>string}};
 return {user:env.MBA_CURRENT_USER,wallet:env.MBA_API?.getPortfolioId?.()};
}
function draftPrefix(){const {user,wallet}=draftContext();return user?.id&&wallet?'mba-qa-v2:'+user.id+':'+wallet+':':'';}
function draftAccessScope(){
 const {user,wallet}=draftContext();
 return user?JSON.stringify([user.id,wallet,user.role,user.is_master_admin,user.access_kind,Object.entries(user.permissions||{}).sort(([a],[b])=>a.localeCompare(b))]):'';
}
let draftScope=draftAccessScope();
function reconcileDrafts(event:string){
 const next=draftAccessScope();
 const {user}=draftContext();
 const purgeAll=['mba:logged-out','mba:session-expired','mba:portfolio-changed'].includes(event) || (!!draftScope && next!==draftScope) || (!!user && user.permissions?.['tasks.view']!==true);
 const prefix=draftPrefix();
 const legacyPrefix=user?.id?'mba-qa-v1:'+user.id+':':'';
 try{for(const key of Object.keys(sessionStorage)){
   if(!key.startsWith('mba-qa-v1:')&&!key.startsWith('mba-qa-v2:'))continue;
   if(purgeAll || (prefix && !(key.startsWith(prefix)||key.startsWith(legacyPrefix))))sessionStorage.removeItem(key);
 }}catch{/* Storage unavailable. */}
 draftScope=next;
}
for(const event of ['mba:logged-out','mba:session-expired','mba:portfolio-changed','mba:profile-ready','mba:authenticated'])window.addEventListener(event,()=>reconcileDrafts(event));
// The module may load after auth emitted its first profile event.
reconcileDrafts('bootstrap');
