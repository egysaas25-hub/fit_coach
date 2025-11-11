// lib/api/services/subscription.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/shared/response';
import { Subscription, SubscriptionPlan, Invoice, Payment } from '@/types/domain/subscription';

export class SubscriptionService {
  async getSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await apiClient.get<ApiResponse<Subscription[]>>(endpoints.admin.analytics.dashboard);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw new Error('Failed to fetch subscriptions');
    }
  }

  async createSubscription(subscription: Partial<Subscription>): Promise<Subscription> {
    try {
      const response = await apiClient.post<ApiResponse<Subscription>>(
        endpoints.admin.analytics.dashboard,
        subscription
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  async getInvoices(subscriptionId: string): Promise<Invoice[]> {
    try {
      const response = await apiClient.get<ApiResponse<Invoice[]>>(
        `${endpoints.admin.analytics.dashboard}/${subscriptionId}/invoices`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw new Error('Failed to fetch invoices');
    }
  }

  async getPayments(subscriptionId: string): Promise<Payment[]> {
    try {
      const response = await apiClient.get<ApiResponse<Payment[]>>(
        `${endpoints.admin.analytics.dashboard}/${subscriptionId}/payments`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw new Error('Failed to fetch payments');
    }
  }
}