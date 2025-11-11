// types/domain/template.ts
export interface MessageTemplate {
  id: string;
  name: string;
  type: TemplateType;
  content: string;
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
}

export enum TemplateType {
  Email = 'Email',
  SMS = 'SMS',
  Notification = 'Notification',
}

export enum TemplateStatus {
  Active = 'Active',
  Draft = 'Draft',
  Archived = 'Archived',
}

export interface TemplateState {
  templates: MessageTemplate[];
  loading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  createTemplate: (template: Partial<MessageTemplate>) => Promise<MessageTemplate>;
  updateTemplate: (id: string, template: Partial<MessageTemplate>) => Promise<MessageTemplate>;
  deleteTemplate: (id: string) => Promise<void>;
}