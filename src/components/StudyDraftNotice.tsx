import React from 'react';

export function StudyDraftNotice({ statuses }: { statuses: readonly string[] }) {
  const failed = statuses.includes('unavailable');
  const invalid = statuses.includes('invalid');
  return <p role={failed || invalid ? 'alert' : 'status'} className={`text-xs ${failed || invalid ? 'text-status-warning' : 'text-[var(--dim)]'}`}>
    {failed ? 'Não foi possível salvar neste navegador. Copie seu texto antes de sair.'
      : invalid ? 'Um registro local não pôde ser recuperado. O conteúdo novo será salvo ao editar.'
      : statuses.some(status => status === 'saved' || status === 'restored') ? 'Trabalho salvo neste navegador, separado por conta e assunto.'
      : 'Seu trabalho será salvo neste navegador enquanto você escreve. Não há sincronização entre dispositivos.'}
  </p>;
}
