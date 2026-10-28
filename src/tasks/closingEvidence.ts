type SourceRecord = Record<string, unknown>;

function asRecord(value: unknown): SourceRecord | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as SourceRecord : null;
}

function clean(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const result = value.replace(/\s+/g, ' ').trim();
  return result ? result : null;
}

/**
 * Uma classificação sozinha não constitui evidência. A confirmação preliminar
 * é exibida somente quando existe um motivo ou um movimento DataJud capturado.
 * Nunca transforme observações genéricas sobre captura limitada em prova jurídica.
 */
export function closingClassifierEvidence(metadataValue: unknown, reasonLabel?: unknown): string | null {
  const metadata = asRecord(metadataValue) || {};
  const explicit = [
    metadata.review_reason,
    metadata.indicio_movimentacao,
    metadata.datajud_tipo,
  ].map(clean).find(Boolean);
  if (explicit) return explicit.slice(0, 280);

  const review = asRecord(metadata.datajud_victory_review);
  const evidenceList = review && Array.isArray(review.evidencias) ? review.evidencias : [];
  for (const entry of evidenceList) {
    const evidence = asRecord(entry);
    if (!evidence) continue;
    // Observações do classificador não substituem a movimentação judicial.
    const movement = clean(evidence.texto);
    if (!movement) continue;
    const date = clean(evidence.data);
    const iso = date && /^\d{4}-\d{2}-\d{2}(?:$|T)/.test(date) ? date.slice(0, 10) : null;
    const ddmmyyyy = iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4) : null;
    const definitiveness = asRecord(review?.definitividade);
    const qualification = definitiveness?.confirmada === false
      ? ' (trânsito em julgado não confirmado)' : '';
    return (ddmmyyyy
      ? 'Movimentação DataJud de ' + ddmmyyyy + ': ' + movement + qualification
      : 'Movimentação DataJud: ' + movement + qualification).slice(0, 280);
  }

  // Compatibilidade com fontes operacionais que fornecem motivo próprio.
  return clean(reasonLabel)?.slice(0, 280) || null;
}
