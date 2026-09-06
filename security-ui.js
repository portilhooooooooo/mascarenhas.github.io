(() => {
  'use strict';
  const dialog = document.createElement('dialog');
  dialog.setAttribute('aria-label', 'Ativar autenticador');
  dialog.innerHTML = `<form><h2>Ativar autenticador</h2><p data-email></p><p>Escaneie o QR no seu autenticador. Ele será exibido somente agora.</p><img width="280" height="280" alt="QR de ativação do autenticador"><label>Código de confirmação <input name="totp" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" autocomplete="one-time-code" required></label><p role="status"></p><button type="submit">Confirmar</button><button type="button" data-close>Fechar</button></form>`;
  document.body.append(dialog);
  let enrollment = null;
  const clear = () => { enrollment = null; dialog.querySelector('img').removeAttribute('src'); dialog.querySelector('form').reset(); };
  dialog.addEventListener('close', clear);
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  window.MBA_SHOW_ENROLLMENT = (value, email) => {
    clear(); enrollment = {...value, email};
    const qr = window.qrcode(0, 'M'); qr.addData(value.otpauth_uri); qr.make();
    dialog.querySelector('img').src = qr.createDataURL(4, 8);
    dialog.querySelector('[data-email]').textContent = email;
    dialog.querySelector('[role="status"]').textContent = 'Confirme em até 15 minutos, a partir de uma rede autorizada.';
    dialog.showModal();
  };
  dialog.querySelector('form').addEventListener('submit', async event => {
    event.preventDefault(); if (!enrollment) return;
    const form = event.currentTarget, button = form.querySelector('[type="submit"]'); button.disabled = true;
    try {
      await window.MBA_API.request('/api/operational/enrollment/confirm', {method: 'POST', body: JSON.stringify({email: enrollment.email, enrollment_id: enrollment.enrollment_id, enrollment_token: enrollment.enrollment_token, totp: form.elements.totp.value})});
      dialog.close(); window.alert('Autenticador confirmado. Aguarde o próximo código para entrar.');
    } catch (error) { dialog.querySelector('[role="status"]').textContent = error.message; }
    finally { form.elements.totp.value = ''; button.disabled = false; }
  });
  const section = document.createElement('section'); section.hidden = true; section.className = 'master-admin-only';
  section.innerHTML = '<h3>Redes operacionais</h3><p data-network-status></p><button type="button">Autorizar IP atual</button>';
  document.getElementById('permissions-editor')?.append(section);
  let version;
  const refresh = async () => {
    const data = await window.MBA_API.request('/api/security/network'); version = data.version;
    section.querySelector('p').textContent = `IP detectado: ${data.current_ip}. Redes autorizadas: ${(data.operational_allowed_networks || []).join(', ') || 'nenhuma'}.`;
    section.hidden = false;
  };
  window.addEventListener('mba:authenticated', event => { if (event.detail.is_master_admin) refresh().catch(() => { section.hidden = true; }); });
  section.querySelector('button').addEventListener('click', async event => {
    event.currentTarget.disabled = true;
    try { await window.MBA_API.request('/api/security/network/authorize-current', {method: 'POST', body: JSON.stringify({expected_version: version, motivo: 'IP atual autorizado pelo administrador'})}); await refresh(); }
    catch (error) { window.alert(error.message); }
    finally { section.querySelector('button').disabled = false; }
  });
})();
