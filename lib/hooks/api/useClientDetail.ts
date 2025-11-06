// lib/hooks/api/useClientDetail.ts
import { useState, useEffect, useCallback } from 'react';
import { Program } from '@/types/domain/program';

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
}

interface Progress {
  id: string;
  clientId: string;
  metric: string; // e.g., 'Weight', 'Body Fat'
  value: number;
  recordedAt: string;
}

interface Activity {
  id: string;
  clientId: string;
  action: string; // e.g., 'Completed Workout'
  timestamp: string;
}

export function useClientDetail(clientId: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      const data = await response.json();
      setClient(data as Client);
    } catch (err) {
      setError('Failed to fetch client details');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return { client, loading, error, refetch: fetchClient };
}

export function useClientProgress(clientId: string) {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/progress`);
      const data = await response.json();
      setProgress(data as Progress[]);
    } catch (err) {
      setError('Failed to fetch client progress');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, error, refetch: fetchProgress };
}

export function useClientPrograms(clientId: string) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/programs`);
      const data = await response.json();
      setPrograms(data as Program[]);
    } catch (err) {
      setError('Failed to fetch client programs');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return { programs, loading, error, refetch: fetchPrograms };
}

export function useClientActivity(clientId: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/activities`);
      const data = await response.json();
      setActivities(data as Activity[]);
    } catch (err) {
      setError('Failed to fetch client activities');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
}