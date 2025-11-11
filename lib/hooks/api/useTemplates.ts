// lib/hooks/api/useTemplates.ts
import { useState, useEffect, useCallback } from 'react';
import { TemplateService } from '@/lib/api/services/template.service';
import { MessageTemplate } from '@/types/domain/template';

const templateService = new TemplateService();

export function useTemplates() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { templates, loading, error, refetch: fetchTemplates };
}

export function useCreateTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTemplate = useCallback(async (template: Partial<MessageTemplate>) => {
    setLoading(true);
    try {
      const newTemplate = await templateService.createTemplate(template);
      return newTemplate;
    } catch (err) {
      setError('Failed to create template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTemplate, loading, error };
}

export function useUpdateTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTemplate = useCallback(async (id: string, template: Partial<MessageTemplate>) => {
    setLoading(true);
    try {
      const updatedTemplate = await templateService.updateTemplate(id, template);
      return updatedTemplate;
    } catch (err) {
      setError('Failed to update template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTemplate, loading, error };
}

export function useDeleteTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTemplate = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await templateService.deleteTemplate(id);
    } catch (err) {
      setError('Failed to delete template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTemplate, loading, error };
}