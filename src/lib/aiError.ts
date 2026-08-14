// Shared helper so every AI-backed fetch across the app shows the student
// why nothing happened instead of failing silently (only console.error'd).
export async function parseAiErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data?.error) return data.error;
  } catch {
    // response wasn't JSON — fall through to the generic message
  }
  return 'Não foi possível completar a solicitação de IA agora. Tente novamente em instantes.';
}

export const AI_NETWORK_ERROR_MESSAGE = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
