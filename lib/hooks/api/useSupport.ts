// lib/hooks/api/useSupport.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SupportService } from '@/lib/api/services/support.service';
import { Ticket } from '@/types/domain/support';

const supportService = new SupportService();

export function useTickets() {
  return useQuery({
    queryKey: ['support', 'tickets'],
    queryFn: () => supportService.getTickets(),
    staleTime: 60_000,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticket: Partial<Ticket>) => supportService.createTicket(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, updates }: { ticketId: string; updates: Partial<Ticket> }) => supportService.updateTicket(ticketId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
    },
  });
}

export function useTicketStats() {
  return useQuery({
    queryKey: ['support', 'ticket-stats'],
    queryFn: () => supportService.getTicketStats(),
    staleTime: 60_000,
  });
}