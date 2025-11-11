// lib/hooks/api/useBilling.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BillingService } from '@/lib/api/services/billing.service';
import { 
  Subscription, 
  Invoice, 
  Payment, 
  BillingPlan 
} from '@/types/domain/billing';

const billingService = new BillingService();

/**
 * Hook for billing subscriptions
 * Rule 1: Component calls hook
 * Rule 2: Hook calls service
 */
export function useSubscriptions() {
  return useQuery({
    queryKey: ['billing', 'subscriptions'],
    queryFn: () => billingService.getSubscriptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for billing invoices
 */
export function useInvoices() {
  return useQuery({
    queryKey: ['billing', 'invoices'],
    queryFn: () => billingService.getInvoices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for billing payments
 */
export function usePayments() {
  return useQuery({
    queryKey: ['billing', 'payments'],
    queryFn: () => billingService.getPayments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for billing plans
 */
export function useBillingPlans() {
  return useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => billingService.getBillingPlans(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a billing plan
 */
export function useCreateBillingPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (plan: Omit<BillingPlan, 'id' | 'createdAt' | 'updatedAt'>) => 
      billingService.createBillingPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'plans'] });
    },
  });
}

/**
 * Hook to update a billing plan
 */
export function useUpdateBillingPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: Partial<BillingPlan> }) => 
      billingService.updateBillingPlan(id, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'plans'] });
    },
  });
}