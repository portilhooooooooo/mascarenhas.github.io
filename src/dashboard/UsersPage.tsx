import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Ban,
  Check,
  ChevronRight,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';

type Api = {
  request: (path: string, options?: RequestInit) => Promise<any>;
};

type Permission = {
  id: string;
  key: string;
  description?: string | null;
};

type EffectivePermission = {
  key: string;
  allowed: boolean;
  source?: string;
};

type ManagedUser = {
  id: string;
  name?: string | null;
  email: string;
  role: 'admin' | 'user' | string;
  active: boolean;
  account_locked?: boolean;
  auth_provider?: string;
  access_kind?: string;
  permission_map?: Record<string, boolean>;
  effective_permissions?: EffectivePermission[];
  created_at?: string;
  updated_at?: string;
};

type CurrentUser = {
  id?: string;
  email?: string;
  is_master_admin?: boolean;
  permissions?: Record<string, boolean>;
};

type UsersWindow = Window & typeof globalThis & {
  MBA_API?: Api;
  MBA_CURRENT_USER?: CurrentUser;
};

const mbaWindow = window as UsersWindow;
const MASTER_EMAIL = 'gabriel.portilho@mascarenhasbarbosa.com.br';

const SECTION_LABELS: Record<string, string> = {
  dashboard: 'Gestão processual',
  tasks: 'Tarefas',
  automations: 'Automações',
  tutelas: 'Tutelas',
  encerramentos: 'Encerramentos',
  pagamentos: 'Pagamentos',
  agreements: 'Acordos',
  analytics: 'Resultados e BI',
  bases: 'Base de dados',
  settings: 'Configurações',
  users: 'Usuários e acessos',
};

const SECTION_ORDER = [
  'dashboard',
  'tasks',
  'automations',
  'tutelas',
  'encerramentos',
  'pagamentos',
  'agreements',
  'analytics',
  'bases',
  'settings',
  'users',
];

function apiRequest(path: string, options?: RequestInit) {
  if (!mbaWindow.MBA_API) {
    return Promise.reject(new Error('A API ainda não está disponível.'));
  }
  return mbaWindow.MBA_API.request(path, options);
}

function initials(user: ManagedUser) {
  return String(user.name || user.email || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'U';
}

function isProtectedUser(user: ManagedUser | null) {
  return user?.email?.trim().toLowerCase() === MASTER_EMAIL;
}

function sourceLabel(source?: string) {
  if (source === 'master') return 'Administrador raiz';
  if (source === 'override_allow') return 'Liberação individual';
  if (source === 'override_deny') return 'Bloqueio individual';
  if (source === 'exclusive_policy') return 'Política exclusiva';
  return 'Perfil padrão';
}

function statusOf(user: ManagedUser) {
  if (!user.active) return { label: 'Desativado', className: 'inactive' };
  if (user.account_locked) return { label: 'Bloqueado', className: 'locked' };
  return { label: 'Ativo', className: 'active' };
}

function permissionMap(user: ManagedUser | null) {
  if (!user) return {};
  if (user.permission_map) return { ...user.permission_map };
  return Object.fromEntries(
    (user.effective_permissions || []).map(item => [item.key, item.allowed]),
  );
}

export function UsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftPermissions, setDraftPermissions] = useState<Record<string, boolean>>({});
  const [draftActive, setDraftActive] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const currentUser = mbaWindow.MBA_CURRENT_USER;
  const canView = currentUser?.permissions?.['users.view'] === true;
  const canManage = currentUser?.permissions?.['users.manage'] === true
    && currentUser?.is_master_admin === true;

  const selected = useMemo(
    () => users.find(user => user.id === selectedId) || null,
    [users, selectedId],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    return users.filter(user => {
      const matchesTerm = !term
        || `${user.name || ''} ${user.email}`.toLocaleLowerCase('pt-BR').includes(term);
      const state = statusOf(user).className;
      const matchesStatus = !statusFilter || state === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const groups = useMemo(() => {
    const grouped = new Map<string, Permission[]>();
    permissions.forEach(permission => {
      const section = permission.key.split('.')[0] || 'other';
      grouped.set(section, [...(grouped.get(section) || []), permission]);
    });
    return SECTION_ORDER
      .filter(section => grouped.has(section))
      .map(section => ({
        section,
        label: SECTION_LABELS[section] || section,
        permissions: grouped.get(section) || [],
      }));
  }, [permissions]);

  async function load(preferredId?: string | null) {
    if (!canView) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setPageError('');
    try {
      const [usersPayload, permissionPayload] = await Promise.all([
        apiRequest('/api/users'),
        apiRequest('/api/permissions'),
      ]);
      const rows = Array.isArray(usersPayload) ? usersPayload : [];
      setUsers(rows);
      setPermissions(Array.isArray(permissionPayload) ? permissionPayload : []);
      const nextId = preferredId && rows.some((row: ManagedUser) => row.id === preferredId)
        ? preferredId
        : selectedId && rows.some((row: ManagedUser) => row.id === selectedId)
          ? selectedId
          : rows[0]?.id || null;
      setSelectedId(nextId);
    } catch (error: any) {
      setPageError(error?.message || 'Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [canView]);

  useEffect(() => {
    if (!selected) return;
    setDraftPermissions(permissionMap(selected));
    setDraftActive(Boolean(selected.active));
    setFeedback('');
  }, [selected]);

  if (!canView) {
    return (
      <section className="users-denied" aria-label="Acesso negado">
        <LockKeyhole />
        <h1>Usuários</h1>
        <p>Seu perfil não possui autorização para visualizar este módulo.</p>
      </section>
    );
  }

  const totalActive = users.filter(user => user.active && !user.account_locked).length;
  const totalAuthorized = users.filter(user => Object.values(permissionMap(user)).some(Boolean)).length;
  const totalBlocked = users.filter(user => user.account_locked || !user.active).length;
  const selectedProtected = isProtectedUser(selected);
  const selectedEffective = Object.fromEntries(
    (selected?.effective_permissions || []).map(item => [item.key, item]),
  );

  async function saveSelected() {
    if (!selected || !canManage || selectedProtected) return;
    setSaving(true);
    setPageError('');
    setFeedback('');
    try {
      if (draftActive !== selected.active) {
        await apiRequest(
          `/api/users/${selected.id}/${draftActive ? 'activate' : 'deactivate'}`,
          {
            method: 'POST',
            body: JSON.stringify({
              motivo: draftActive
                ? 'Reativação pela gestão de acessos'
                : 'Desativação pela gestão de acessos',
            }),
          },
        );
      }

      const editable = permissions
        .filter(permission => !permission.key.startsWith('users.'))
        .map(permission => ({
          permission_id: permission.id,
          allowed: draftPermissions[permission.key] === true,
        }));

      await apiRequest(`/api/users/${selected.id}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ permissions: editable }),
      });
      setFeedback('Alterações salvas.');
      await load(selected.id);
    } catch (error: any) {
      setPageError(error?.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  }

  async function revokeSessions() {
    if (!selected || !canManage || selectedProtected) return;
    if (!window.confirm(`Revogar todas as sessões de ${selected.name || selected.email}?`)) return;
    setSaving(true);
    setPageError('');
    try {
      await apiRequest(`/api/users/${selected.id}/sessions/revoke`, {
        method: 'POST',
        body: JSON.stringify({ motivo: 'Revogação manual pela gestão de acessos' }),
      });
      setFeedback('Sessões revogadas.');
    } catch (error: any) {
      setPageError(error?.message || 'Não foi possível revogar as sessões.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="users-react-page">
      <header className="users-page-header">
        <div>
          <span className="users-eyebrow">Administração</span>
          <h1>Usuários e autorizações</h1>
          <p>Controle o acesso ao frontend e às ações protegidas da API por usuário.</p>
        </div>
        <div className="users-header-actions">
          <button className="users-button secondary" type="button" onClick={() => load(selectedId)} disabled={loading}>
            <RefreshCw className={loading ? 'spinning' : ''} />
            Atualizar
          </button>
          {canManage && (
            <button className="users-button primary" type="button" onClick={() => setCreateOpen(true)}>
              <UserPlus />
              Adicionar usuário
            </button>
          )}
        </div>
      </header>

      <section className="users-summary" aria-label="Resumo de usuários">
        <article><span><Users /></span><div><strong>{users.length}</strong><small>Cadastrados</small></div></article>
        <article><span><UserCheck /></span><div><strong>{totalActive}</strong><small>Ativos</small></div></article>
        <article><span><ShieldCheck /></span><div><strong>{totalAuthorized}</strong><small>Com acesso</small></div></article>
        <article><span><Ban /></span><div><strong>{totalBlocked}</strong><small>Bloqueados ou inativos</small></div></article>
      </section>

      {pageError && <div className="users-alert error" role="alert">{pageError}</div>}
      {feedback && <div className="users-alert success" role="status"><Check />{feedback}</div>}

      <div className="users-workspace">
        <section className="users-list-panel" aria-label="Lista de usuários">
          <div className="users-toolbar">
            <label className="users-search">
              <Search />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Buscar nome ou e-mail"
                aria-label="Buscar usuários"
              />
            </label>
            <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label="Filtrar status">
              <option value="">Todos</option>
              <option value="active">Ativos</option>
              <option value="locked">Bloqueados</option>
              <option value="inactive">Desativados</option>
            </select>
          </div>

          <div className="users-list">
            {loading ? (
              <div className="users-state"><LoaderCircle className="spinning" /><strong>Carregando usuários</strong></div>
            ) : filtered.length ? filtered.map(user => {
              const state = statusOf(user);
              const count = Object.values(permissionMap(user)).filter(Boolean).length;
              return (
                <button
                  type="button"
                  key={user.id}
                  className={`users-list-row ${user.id === selectedId ? 'selected' : ''}`}
                  onClick={() => setSelectedId(user.id)}
                >
                  <span className="users-avatar">{initials(user)}</span>
                  <span className="users-identity">
                    <strong>{user.name || 'Sem nome'}</strong>
                    <small>{user.email}</small>
                  </span>
                  <span className="users-row-meta">
                    <em className={`users-status ${state.className}`}>{state.label}</em>
                    <small>{count} permissões</small>
                  </span>
                  <ChevronRight />
                </button>
              );
            }) : (
              <div className="users-state"><Users /><strong>Nenhum usuário encontrado</strong></div>
            )}
          </div>
        </section>

        <section className="users-detail-panel" aria-label="Autorizações do usuário selecionado">
          {selected ? (
            <>
              <header className="users-detail-header">
                <span className="users-avatar large">{initials(selected)}</span>
                <div className="users-detail-identity">
                  <div className="users-name-row">
                    <h2>{selected.name || 'Sem nome'}</h2>
                    {selectedProtected && <span className="users-root-badge"><KeyRound />Conta protegida</span>}
                  </div>
                  <span><Mail />{selected.email}</span>
                  <div className="users-detail-chips">
                    <span>{selected.role === 'admin' ? 'Administrador' : 'Usuário'}</span>
                    <span>Microsoft Entra</span>
                    <span className={`state-${statusOf(selected).className}`}>{statusOf(selected).label}</span>
                  </div>
                </div>
                {canManage && !selectedProtected && (
                  <button className="users-text-action" type="button" onClick={revokeSessions} disabled={saving}>
                    Revogar sessões
                  </button>
                )}
              </header>

              <div className="users-access-state">
                <div>
                  <strong>Acesso ao Backoffice</strong>
                  <small>Ao desativar, novas requisições autenticadas passam a ser recusadas.</small>
                </div>
                <label className="users-switch">
                  <input
                    type="checkbox"
                    checked={draftActive}
                    onChange={event => setDraftActive(event.target.checked)}
                    disabled={!canManage || selectedProtected}
                  />
                  <span />
                </label>
              </div>

              <div className="users-permission-heading">
                <div><strong>Autorizações</strong><small>O frontend e a API utilizam as mesmas chaves de permissão.</small></div>
                <span>{Object.values(draftPermissions).filter(Boolean).length} liberadas</span>
              </div>

              <div className="users-permission-groups">
                {groups.map(group => (
                  <section className="users-permission-group" key={group.section}>
                    <header><strong>{group.label}</strong></header>
                    {group.permissions.map(permission => {
                      const exclusive = permission.key.startsWith('users.') && !selectedProtected;
                      const disabled = !canManage || selectedProtected || exclusive;
                      const effective = selectedEffective[permission.key];
                      return (
                        <label className={`users-permission-row ${disabled ? 'disabled' : ''}`} key={permission.id}>
                          <span>
                            <strong>{permission.description || permission.key}</strong>
                            <small>
                              <code>{permission.key}</code>
                              <span>{exclusive ? 'Exclusivo do administrador raiz' : sourceLabel(effective?.source)}</span>
                            </small>
                          </span>
                          <span className="users-switch">
                            <input
                              type="checkbox"
                              checked={draftPermissions[permission.key] === true}
                              onChange={event => setDraftPermissions(current => ({
                                ...current,
                                [permission.key]: event.target.checked,
                              }))}
                              disabled={disabled}
                            />
                            <span />
                          </span>
                        </label>
                      );
                    })}
                  </section>
                ))}
              </div>

              {canManage && (
                <footer className="users-detail-footer">
                  <span>{selectedProtected ? 'A conta raiz não pode ser alterada por esta interface.' : 'Mudanças passam a valer nas próximas requisições.'}</span>
                  <button
                    className="users-button primary"
                    type="button"
                    onClick={saveSelected}
                    disabled={saving || selectedProtected}
                  >
                    {saving ? <LoaderCircle className="spinning" /> : <BadgeCheck />}
                    Salvar alterações
                  </button>
                </footer>
              )}
            </>
          ) : (
            <div className="users-state detail"><ShieldCheck /><strong>Selecione um usuário</strong><span>As autorizações aparecerão aqui.</span></div>
          )}
        </section>
      </div>

      {createOpen && (
        <CreateUserDialog
          onClose={() => setCreateOpen(false)}
          onCreated={async user => {
            setCreateOpen(false);
            await load(user.id);
            setFeedback('Usuário criado.');
          }}
        />
      )}
    </div>
  );
}

function CreateUserDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (user: ManagedUser) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tenant, setTenant] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const external = Boolean(email.trim())
    && !email.trim().toLowerCase().endsWith('@mascarenhasbarbosa.com.br');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload: Record<string, string> = {
        name: name.trim(),
        email: email.trim(),
        auth_provider: 'microsoft',
      };
      if (tenant.trim()) payload.microsoft_tenant_id = tenant.trim();
      const result = await apiRequest('/api/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      await onCreated(result.user);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível criar o usuário.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="users-modal-backdrop" role="presentation" onMouseDown={event => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <section className="users-modal" role="dialog" aria-modal="true" aria-labelledby="users-create-title">
        <header>
          <div><span>Microsoft Entra</span><h2 id="users-create-title">Adicionar usuário</h2></div>
          <button type="button" onClick={onClose} aria-label="Fechar"><X /></button>
        </header>
        <form onSubmit={submit}>
          <label>Nome<input value={name} onChange={event => setName(event.target.value)} maxLength={120} required /></label>
          <label>E-mail corporativo<input value={email} onChange={event => setEmail(event.target.value)} type="email" required /></label>
          <label>
            Tenant Microsoft {external ? <b>obrigatório</b> : <small>opcional</small>}
            <input
              value={tenant}
              onChange={event => setTenant(event.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
              required={external}
            />
            <small>Contas do domínio Mascarenhas usam o tenant padrão automaticamente.</small>
          </label>
          {error && <div className="users-alert error" role="alert">{error}</div>}
          <footer>
            <button className="users-button secondary" type="button" onClick={onClose}>Cancelar</button>
            <button className="users-button primary" type="submit" disabled={submitting}>
              {submitting ? <LoaderCircle className="spinning" /> : <UserPlus />}
              Criar usuário
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
