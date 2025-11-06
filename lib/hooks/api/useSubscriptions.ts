// lib/hooks/api/useSubscriptions.ts
import { useState, useEffect, useCallback } from 'react';
import { SubscriptionService } from '@/lib/api/services/subscription.service';
import { Subscription, Invoice, Payment } from '@/types/domain/subscription';

const subscriptionService = new SubscriptionService();

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subscriptionService.getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return { subscriptions, loading, error, refetch: fetchSubscriptions };
}

export function useCreateSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubscription = useCallback(async (subscription: Partial<Subscription>) => {
    setLoading(true);
    try {
      const newSubscription = await subscriptionService.createSubscription(subscription);
      return newSubscription;
    } catch (err) {
      setError('Failed to create subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createSubscription, loading, error };
}

export function useInvoices(subscriptionId: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subscriptionService.getInvoices(subscriptionId);
      setInvoices(data);
    } catch (err) {
      setError('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  }, [subscriptionId]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, loading, error, refetch: fetchInvoices };
}

export function usePayments(subscriptionId: string) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subscriptionService.getPayments(subscriptionId);
      setPayments(data);
    } catch (err) {
      setError('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, [subscriptionId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, error, refetch: fetchPayments };
}