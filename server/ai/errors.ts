export class AiValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiValidationError';
  }
}

export class AiUnavailableError extends Error {
  constructor(message = 'Serviço de IA não configurado.') {
    super(message);
    this.name = 'AiUnavailableError';
  }
}

export class AiTimeoutError extends Error {
  constructor(message = 'A solicitação de IA excedeu o tempo limite.') {
    super(message);
    this.name = 'AiTimeoutError';
  }
}

export class AiGenerationError extends Error {
  constructor(message = 'Falha ao processar solicitação de IA', options?: ErrorOptions) {
    super(message, options);
    this.name = 'AiGenerationError';
  }
}

