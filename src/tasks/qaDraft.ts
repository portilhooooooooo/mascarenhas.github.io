import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

// Um rascunho por usuário/tarefa/processo, restrito à aba atual.
// Nenhuma resposta em cache é enviada à API antes de "Salvar e próximo".
function read(key: string): Record<string, unknown> {
  if (!key) return {};
  try {
    const raw = sessionStorage.getItem(key);
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
