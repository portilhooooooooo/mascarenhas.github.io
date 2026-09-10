type MbaApi = {
  request: (path: string, options?: RequestInit) => Promise<unknown>;
};

type BaseImportResponse = {
  importacao?: {
    valid_rows?: number;
    total_rows?: number;
    rejected_rows?: number;
  };
};

type BaseImportError = Error & {
  status?: number;
};

type BaseImportWindow = Window & typeof globalThis & {
  MBA_API?: MbaApi;
};

const BASE_IMPORT_TYPES = {
  base_benner: {
    label: 'Upload - Base do Benner',
    endpoint: '/api/base-processual/benner/importar',
    successName: 'Base do Benner',
  },
  base_cpj: {
    label: 'Upload - Base do CPJ',
    endpoint: '/api/base-processual/cpj/importar',
    successName: 'Base do CPJ',
  },
} as const;

type BaseImportType = keyof typeof BASE_IMPORT_TYPES;

function isBaseImportType(value: string): value is BaseImportType {
  return Object.prototype.hasOwnProperty.call(BASE_IMPORT_TYPES, value);
}

function setError(errorBox: HTMLElement | null, message: string) {
  if (errorBox) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    return;
  }
  window.alert(message);
}

export function configureBaseTaskImport() {
  const dialog = document.getElementById('task-dialog') as HTMLDialogElement | null;
  const form = document.getElementById('task-create-form') as HTMLFormElement | null;
  const typeSelect = document.getElementById('task-type') as HTMLSelectElement | null;
  const fileInput = document.getElementById('task-file') as HTMLInputElement | null;
  const errorBox = document.getElementById('task-dialog-error');
  const agreementHelp = document.getElementById('agreement-file-help');
  const participants = document.getElementById('agreement-participants');
  const responsibleField = document.getElementById('task-responsible-field');
  const newTaskButton = document.getElementById('new-task-button');

  if (!dialog || !form || !typeSelect || !fileInput || form.dataset.mbaBaseImportBound === 'true') {
    return () => undefined;
  }

  form.dataset.mbaBaseImportBound = 'true';

  const titleInput = form.elements.namedItem('title') as HTMLInputElement | null;
  const descriptionInput = form.elements.namedItem('description') as HTMLTextAreaElement | null;
  const titleField = titleInput?.closest('label') ?? null;
  const descriptionField = descriptionInput?.closest('label') ?? null;
  const taskGrid = form.querySelector<HTMLElement>('.dialog-grid');
  const headerCopy = form.querySelector<HTMLElement>('header p');
  const submit = form.querySelector<HTMLButtonElement>('footer [type="submit"]');
  const defaultHeaderCopy = headerCopy?.textContent || 'Crie o lote e importe os processos por XLSX ou CSV.';
  const defaultAgreementHelp = agreementHelp?.textContent || 'O XLSX deve conter as colunas Processo e Provisão.';
  const defaultSubmitCopy = submit?.textContent || 'Criar e importar';

  const currentType = () => String(typeSelect.value || '');

  function ensureOptions() {
    for (const [value, config] of Object.entries(BASE_IMPORT_TYPES)) {
      if (typeSelect.querySelector(`option[value="${value}"]`)) continue;
      const option = document.createElement('option');
      option.value = value;
      option.textContent = config.label;
      typeSelect.appendChild(option);
    }
  }

  function syncMode() {
    const type = currentType();
    const baseMode = isBaseImportType(type);
    const agreementMode = type === 'acordos';

    if (titleField) titleField.hidden = baseMode;
    if (descriptionField) descriptionField.hidden = baseMode;
    if (taskGrid) taskGrid.hidden = baseMode;
    if (responsibleField) responsibleField.hidden = baseMode || agreementMode;
    if (participants) participants.hidden = baseMode || !agreementMode;
    if (titleInput) titleInput.required = !baseMode;

    fileInput.accept = baseMode ? '.xlsx' : agreementMode ? '.xlsx' : '.xlsx,.csv';

    if (agreementHelp) {
      agreementHelp.hidden = !baseMode && !agreementMode;
      agreementHelp.textContent = baseMode
        ? 'Envie a planilha XLSX bruta da execução mais recente.'
        : defaultAgreementHelp;
    }

    if (headerCopy) {
      headerCopy.textContent = baseMode
        ? `Importe a ${BASE_IMPORT_TYPES[type].successName.toLowerCase()} para atualizar a base processual.`
        : defaultHeaderCopy;
    }

    if (submit) submit.textContent = baseMode ? 'Importar base' : defaultSubmitCopy;
    if (errorBox) errorBox.hidden = true;
  }

  async function submitBase(event: SubmitEvent) {
    const type = currentType();
    if (!isBaseImportType(type)) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const config = BASE_IMPORT_TYPES[type];
    const api = (window as BaseImportWindow).MBA_API;
    const file = fileInput.files?.[0];

    if (!api) {
      setError(errorBox, 'O módulo da API ainda não está disponível. Atualize a página e tente novamente.');
      return;
    }
    if (!(file instanceof File) || !/\.xlsx$/i.test(file.name)) {
      setError(errorBox, 'Selecione uma planilha XLSX.');
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Importando…';
    }
    if (errorBox) errorBox.hidden = true;

    const body = new FormData();
    body.append('file', file);

    try {
      const result = await api.request(config.endpoint, { method: 'POST', body }) as BaseImportResponse;
      const imported = result?.importacao?.valid_rows;
      const total = result?.importacao?.total_rows;
      const rejected = result?.importacao?.rejected_rows;
      const summary = Number.isFinite(Number(imported))
        ? `${imported} linha(s) válida(s)${Number.isFinite(Number(total)) ? ` de ${total}` : ''}${Number(rejected) ? `; ${rejected} rejeitada(s)` : ''}.`
        : 'Importação concluída.';

      form.reset();
      syncMode();
      dialog.close();
      window.alert(`${config.successName} importada com sucesso. ${summary}`);
    } catch (cause) {
      const error = cause as BaseImportError;
      const messages: Record<number, string> = {
        401: 'Sua sessão expirou. Entre novamente.',
        403: 'Você não possui permissão para importar bases.',
        409: 'Este arquivo já foi importado.',
        413: 'O arquivo excede o limite permitido.',
      };
      setError(errorBox, (error.status && messages[error.status]) || error.message || 'Não foi possível importar a base.');
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = isBaseImportType(currentType()) ? 'Importar base' : defaultSubmitCopy;
      }
    }
  }

  const onTypeChange = () => syncMode();
  const onOpen = () => {
    ensureOptions();
    syncMode();
  };

  typeSelect.addEventListener('change', onTypeChange);
  newTaskButton?.addEventListener('click', onOpen);
  form.addEventListener('submit', submitBase, true);

  ensureOptions();
  syncMode();

  return () => {
    typeSelect.removeEventListener('change', onTypeChange);
    newTaskButton?.removeEventListener('click', onOpen);
    form.removeEventListener('submit', submitBase, true);
    delete form.dataset.mbaBaseImportBound;
  };
}
