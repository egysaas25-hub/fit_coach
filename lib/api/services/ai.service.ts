// lib/api/services/ai.service.ts
import { AITemplate, AILog, AIPrompt, AIResponse } from '@/types/domain/ai';

export class AIService {
  async getAITemplates(): Promise<AITemplate[]> {
    try {
      const response = await fetch('/api/ai/templates');
      const data = await response.json();
      return data as AITemplate[];
    } catch (error) {
      console.error('Error fetching AI templates:', error);
      throw new Error('Failed to fetch AI templates');
    }
  }

  async getAILogs(): Promise<AILog[]> {
    try {
      const response = await fetch('/api/ai/logs');
      const data = await response.json();
      return data as AILog[];
    } catch (error) {
      console.error('Error fetching AI logs:', error);
      throw new Error('Failed to fetch AI logs');
    }
  }

  async createAITemplate(template: Partial<AITemplate>): Promise<AITemplate> {
    try {
      const response = await fetch('/api/ai/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
      const data = await response.json();
      return data as AITemplate;
    } catch (error) {
      console.error('Error creating AI template:', error);
      throw new Error('Failed to create AI template');
    }
  }

  async generateWithAI(prompt: AIPrompt): Promise<AIResponse> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt),
      });
      const data = await response.json();
      return data as AIResponse;
    } catch (error) {
      console.error('Error generating with AI:', error);
      throw new Error('Failed to generate with AI');
    }
  }
}