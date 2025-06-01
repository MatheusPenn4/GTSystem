/**
 * Converte uma string de data do formato ISO para um objeto Date
 * @param dateString String de data no formato ISO
 * @returns Objeto Date ou null se a entrada for inválida
 */
export function formatDateFromString(dateString: string): Date | null {
  if (!dateString) return null;

  try {
    return new Date(dateString);
  } catch (error) {
    console.error(`Erro ao converter data: ${dateString}`, error);
    return null;
  }
}

/**
 * Formata uma data para exibição no formato dd/mm/yyyy
 * @param date Data a ser formatada
 * @returns String formatada ou string vazia se a entrada for inválida
 */
export function formatDisplayDate(date: Date | string | null): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  try {
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error(`Erro ao formatar data: ${date}`, error);
    return '';
  }
}

/**
 * Formata uma data com hora para exibição
 * @param date Data a ser formatada
 * @returns String formatada ou string vazia se a entrada for inválida
 */
export function formatDisplayDateTime(date: Date | string | null): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  try {
    return dateObj.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error(`Erro ao formatar data e hora: ${date}`, error);
    return '';
  }
}
