// lib/mappers/ai.mapper.ts
import { AITemplate, AILog, AIPrompt, AIResponse, TemplateCategory, LogStatus } from '@/types/domain/ai';

interface RawAITemplate {
  template_id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  created_at: string;
  updated_at: string;
}

interface RawAILog {
  log_id: string;
  template_id?: string;
  prompt: string;
  response: RawAIResponse;
  status: string;
  created_at: string;
}

interface RawAIPrompt {
  prompt_id: string;
  content: string;
  category: string;
  created_at: string;
}

interface RawAIResponse {
  response_id: string;
  log_id: string;
  content: string;
  generated_at: string;
}

export class AIMapper {
  static toDomainTemplate(raw: RawAITemplate): AITemplate {
    return {
      id: raw.template_id,
      name: raw.name,
      category: raw.category as TemplateCategory,
      description: raw.description,
      prompt: raw.prompt,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }

  static toDomainTemplates(rawTemplates: RawAITemplate[]): AITemplate[] {
    return rawTemplates.map(this.toDomainTemplate);
  }

  static toDomainLog(raw: RawAILog): AILog {
    return {
      id: raw.log_id,
      templateId: raw.template_id,
      prompt: raw.prompt,
      response: this.toDomainResponse(raw.response),
      status: raw.status as LogStatus,
      createdAt: raw.created_at,
    };
  }

  static toDomainLogs(rawLogs: RawAILog[]): AILog[] {
    return rawLogs.map(this.toDomainLog);
  }

  static toDomainPrompt(raw: RawAIPrompt): AIPrompt {
    return {
      id: raw.prompt_id,
      content: raw.content,
      category: raw.category as TemplateCategory,
      createdAt: raw.created_at,
    };
  }

  static toDomainResponse(raw: RawAIResponse): AIResponse {
    return {
      id: raw.response_id,
      logId: raw.log_id,
      content: raw.content,
      generatedAt: raw.generated_at,
    };
  }
}