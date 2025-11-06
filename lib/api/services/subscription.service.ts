// lib/api/services/subscription.service.ts
import { Subscription, SubscriptionPlan, Invoice, Payment } from '@/types/domain/subscription';

export class SubscriptionService {
  async getSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await fetch('/api/subscriptions');
      const data = await response.json();
      return data as Subscription[];
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw new Error('Failed to fetch subscriptions');
    }
  }

  async createSubscription(subscription: Partial<Subscription>): Promise<Subscription> {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });
      const data = await response.json();
      return data as Subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  async getInvoices(subscriptionId: string): Promise<Invoice[]> {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/invoices`);
      const data = await response.json();
      return data as Invoice[];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw new Error('Failed to fetch invoices');
    }
  }

  async getPayments(subscriptionId: string): Promise<Payment[]> {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/payments`);
      const data = await response.json();
      return data as Payment[];
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw new Error('Failed to fetch payments');
    }
  }
}