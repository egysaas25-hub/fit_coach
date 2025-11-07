// lib/hooks/api/useSupport.ts
import { useState, useEffect, useCallback } from 'react';
import { SupportService } from '@/lib/api/services/support.service';
import { Ticket } from '@/types/domain/support';

const supportService = new SupportService();

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supportService.getTickets();
      setTickets(data);
    } catch (err) {
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refetch: fetchTickets };
}

export function useCreateTicket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTicket = useCallback(async (ticket: Partial<Ticket>) => {
    setLoading(true);
    try {
      const newTicket = await supportService.createTicket(ticket);
      return newTicket;
    } catch (err) {
      setError('Failed to create ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTicket, loading, error };
}

export function useUpdateTicket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTicket = useCallback(async (ticketId: string, updates: Partial<Ticket>) => {
    setLoading(true);
    try {
      const updatedTicket = await supportService.updateTicket(ticketId, updates);
      return updatedTicket;
    } catch (err) {
      setError('Failed to update ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTicket, loading, error };
}

export function useTicketStats() {
  const [stats, setStats] = useState<{ open: number; inProgress: number; resolved: number; avgResponseTime: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supportService.getTicketStats();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch ticket stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}