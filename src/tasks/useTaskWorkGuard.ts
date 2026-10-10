import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiRequest } from './renderers';

declare global {
  interface Window { MBA_CONFIRM_TASK_LEAVE?: () => boolean; }
}

/** Protect in-memory answers. This does not persist a draft or change API payloads. */
export function useTaskWorkGuard(api: ApiRequest, active: boolean) {
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState(0);
  const [discardVersion, setDiscardVersion] = useState(0);
  const dirtyRef = useRef(false);
  const pendingRef = useRef(0);
  const clear = useCallback(() => { dirtyRef.current = false; setDirty(false); }, []);
  const markDirty = useCallback(() => { dirtyRef.current = true; setDirty(true); }, []);
  const allowLeave = useCallback(() => {
    if (pendingRef.current) {
      window.alert('Aguarde o retorno do servidor antes de sair desta análise.');
      return false;
    }
    if (!dirtyRef.current) return true;
    if (!window.confirm('Há respostas ainda não salvas. Sair desta análise e descartar as respostas?')) return false;
    clear();
    setDiscardVersion(value => value + 1);
    return true;
  }, [clear]);
  const request: ApiRequest = useCallback(async (path, options) => {
    const mutation = options?.method && options.method.toUpperCase() !== 'GET';
    if (mutation) { pendingRef.current += 1; setPending(pendingRef.current); }
    try { return await api(path, options); }
    finally { if (mutation) { pendingRef.current -= 1; setPending(pendingRef.current); } }
  }, [api]);
  useEffect(() => {
    if (!active) return;
    window.MBA_CONFIRM_TASK_LEAVE = allowLeave;
    const unload = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current && !pendingRef.current) return;
      event.preventDefault(); event.returnValue = '';
    };
    window.addEventListener('beforeunload', unload);
    return () => {
      if (window.MBA_CONFIRM_TASK_LEAVE === allowLeave) delete window.MBA_CONFIRM_TASK_LEAVE;
      window.removeEventListener('beforeunload', unload);
    };
  }, [active, allowLeave]);
  return { dirty, busy: pending > 0, discardVersion, markDirty, clear, allowLeave, request };
}
