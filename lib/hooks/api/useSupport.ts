// lib/hooks/api/useSupport.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupportService } from '@/lib/api/services/support.service';
import { 
  SupportTicket,
  SupportMessage,
  SupportCategory
} from '@/types/domain/support';

const supportService = new SupportService();

/**
 * Hook for support tickets
 * Rule 1: Component calls hook
 * Rule 2: Hook calls service
 */
export function useSupportTickets() {
  return useQuery({
    queryKey: ['support', 'tickets'],
    queryFn: () => supportService.getTickets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for a specific support ticket
 */
export function useSupportTicket(id: string) {
  return useQuery({
    queryKey: ['support', 'ticket', id],
    queryFn: () => supportService.getTicketById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a support ticket
 */
export function useCreateSupportTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>) => 
      supportService.createTicket(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
    },
  });
}

/**
 * Hook to update a support ticket
 */
export function useUpdateSupportTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ticket }: { id: string; ticket: Partial<SupportTicket> }) => 
      supportService.updateTicket(id, ticket),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support', 'ticket', variables.id] });
    },
  });
}

/**
 * Hook for support categories
 */
export function useSupportCategories() {
  return useQuery({
    queryKey: ['support', 'categories'],
    queryFn: () => supportService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for ticket messages
 */
export function useTicketMessages(ticketId: string) {
  return useQuery({
    queryKey: ['support', 'ticket', ticketId, 'messages'],
    queryFn: () => supportService.getTicketMessages(ticketId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to add a message to a ticket
 */
export function useAddTicketMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, message }: { ticketId: string; message: Omit<SupportMessage, 'id' | 'createdAt' | 'updatedAt'> }) => 
      supportService.addMessage(ticketId, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['support', 'ticket', variables.ticketId, 'messages'] });
    },
  });
}