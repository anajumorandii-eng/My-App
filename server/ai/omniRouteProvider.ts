import type { AiGenerationRequest, AiProvider } from './types';

const DEFAULT_BASE_URL = 'https://instance-20260813-1047.tail98f64c.ts.net/v1';
const DEFAULT_MODEL = 'juju-deep-v1';

type FetchLike = typeof fetch;

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
}

export class OmniRouteProvider implements AiProvider {
  readonly name = 'omniroute';
  readonly model: string;
  readonly isConfigured: boolean;
  private readonly baseUrl: string;

  constructor(
    private readonly apiKey: string | undefined,
    baseUrl = DEFAULT_BASE_URL,
    model = DEFAULT_MODEL,
    private readonly fetchImpl: FetchLike = fetch,
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.model = model;
    this.isConfigured = Boolean(apiKey && this.baseUrl && model);
  }

  async generate({ prompt }: AiGenerationRequest): Promise<string> {
    if (!this.apiKey) throw new Error('OmniRoute API not configured.');

    const response = await this.fetchImpl(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`OmniRoute request failed with status ${response.status}.`);
    }

    const payload = await response.json() as ChatCompletionResponse;
    return payload.choices?.[0]?.message?.content ?? '';
  }
}
