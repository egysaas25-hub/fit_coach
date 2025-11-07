// lib/store/subscription.store.ts
import { create } from 'zustand';
import {
  Subscription,
  Invoice,
  Payment,
  SubscriptionState,
} from '@/types/domain/subscription';
import {
  useSubscriptions,
  useInvoices,
  usePayments,
} from '@/lib/hooks/api/useSubscriptions';

export const useSubscriptionStore = create<SubscriptionState>(set => ({
  subscriptions: [],
  invoices: {},
  payments: {},
  loading: false,
  error: null,
  fetchSubscriptions: async () => {
    set({ loading: true });
    try {
      const { subscriptions, error } = await useSubscriptions();
      set({ subscriptions, error, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch subscriptions', loading: false });
    }
  },
  fetchInvoices: async (subscriptionId: string) => {
    set({ loading: true });
    try {
      const { invoices, error } = await useInvoices(subscriptionId);
      set(state => ({
        invoices: { ...state.invoices, [subscriptionId]: invoices },
        error,
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to fetch invoices', loading: false });
    }
  },
  fetchPayments: async (subscriptionId: string) => {
    set({ loading: true });
    try {
      const { payments, error } = await usePayments(subscriptionId);
      set(state => ({
        payments: { ...state.payments, [subscriptionId]: payments },
        error,
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to fetch payments', loading: false });
    }
  },
}));
