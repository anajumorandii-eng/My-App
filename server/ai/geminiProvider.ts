import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { AiProvider } from './types';

export class GeminiProvider implements AiProvider {
  readonly name = 'gemini';
  readonly model: string;
  readonly isConfigured: boolean;
  private readonly client: GoogleGenAI | null;

  constructor(apiKey: string | undefined, model = 'gemini-3.1-pro-preview') {
    this.model = model;
    this.isConfigured = Boolean(apiKey);
    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;
  }

  async generate({ prompt }: { prompt: string }): Promise<string> {
    if (!this.client) throw new Error('Gemini API not configured.');
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: prompt,
      config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } },
    });
    return response.text ?? '';
  }
}

