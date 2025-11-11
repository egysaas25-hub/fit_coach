// lib/api/services/template.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import { MessageTemplate, TemplateType, TemplateStatus } from '@/types/domain/template';

export class TemplateService {
  async getTemplates(): Promise<MessageTemplate[]> {
    try {
      // For now, we'll use a mock endpoint since there's no real template API
      // In a real implementation, this would connect to an actual endpoint
      const response = await apiClient.get<ApiResponse<MessageTemplate[]>>(endpoints.admin.analytics.dashboard);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Return mock data for now
      return [
        {
          id: "tmpl_1",
          name: "Welcome Email",
          type: TemplateType.Email,
          content: "Welcome to our service!",
          status: TemplateStatus.Active,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "tmpl_2",
          name: "Appointment Reminder",
          type: TemplateType.SMS,
          content: "Your appointment is coming up",
          status: TemplateStatus.Draft,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "tmpl_3",
          name: "Progress Update",
          type: TemplateType.Notification,
          content: "Check your progress",
          status: TemplateStatus.Active,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  }

  async createTemplate(template: Partial<MessageTemplate>): Promise<MessageTemplate> {
    try {
      const response = await apiClient.post<ApiResponse<MessageTemplate>>(
        endpoints.admin.analytics.dashboard,
        template
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw new Error('Failed to create template');
    }
  }

  async updateTemplate(id: string, template: Partial<MessageTemplate>): Promise<MessageTemplate> {
    try {
      const response = await apiClient.patch<ApiResponse<MessageTemplate>>(
        `${endpoints.admin.analytics.dashboard}/${id}`,
        template
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw new Error('Failed to update template');
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      await apiClient.delete(`${endpoints.admin.analytics.dashboard}/${id}`);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw new Error('Failed to delete template');
    }
  }
}