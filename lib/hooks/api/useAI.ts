// lib/hooks/api/useAI.ts
import { useState, useEffect, useCallback } from 'react';
import { AIService } from '@/lib/api/services/ai.service';
import { AITemplate, AILog, AIPrompt, AIResponse } from '@/types/domain/ai';

const aiService = new AIService();

export function useAITemplates() {
  const [templates, setTemplates] = useState<AITemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await aiService.getAITemplates();
      setTemplates(data);
    } catch (err) {
      setError('Failed to fetch AI templates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { templates, loading, error, refetch: fetchTemplates };
}

export function useAILogs() {
  const [logs, setLogs] = useState<AILog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await aiService.getAILogs();
      setLogs(data);
    } catch (err) {
      setError('Failed to fetch AI logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
}

export function useCreateAITemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTemplate = useCallback(async (template: Partial<AITemplate>) => {
    setLoading(true);
    try {
      const newTemplate = await aiService.createAITemplate(template);
      return newTemplate;
    } catch (err) {
      setError('Failed to create AI template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTemplate, loading, error };
}

export function useGenerateWithAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWithAI = useCallback(async (prompt: AIPrompt) => {
    setLoading(true);
    try {
      const response = await aiService.generateWithAI(prompt);
      return response;
    } catch (err) {
      setError('Failed to generate with AI');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateWithAI, loading, error };
}