// lib/api/services/billing.service.ts
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { 
  Subscription, 
  Invoice, 
  Payment, 
  BillingPlan 
} from '@/types/domain/billing';
import { ApiResponse } from '@/types/shared/response';

/**
 * Billing Service
 * Rule 5: Service calls apiClient
 * Rule 6: Uses endpoints
 */
export class BillingService {
  /**
   * Get all subscriptions
   */
  async getSubscriptions(): Promise<Subscription[]> {
    const response = await apiClient.get<ApiResponse<Subscription[]>>(
      endpoints.admin.billing.subscriptions
    );
    return response.data.data;
  }

  /**
   * Get subscription by ID
   */
  async getSubscriptionById(id: string): Promise<Subscription> {
    const response = await apiClient.get<ApiResponse<Subscription>>(
      `${endpoints.admin.billing.subscriptions}/${id}`
    );
    return response.data.data;
  }

  /**
   * Get invoices
   */
  async getInvoices(): Promise<Invoice[]> {
    const response = await apiClient.get<ApiResponse<Invoice[]>>(
      endpoints.admin.billing.invoices
    );
    return response.data.data;
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(id: string): Promise<Invoice> {
    const response = await apiClient.get<ApiResponse<Invoice>>(
      `${endpoints.admin.billing.invoices}/${id}`
    );
    return response.data.data;
  }

  /**
   * Get payments
   */
  async getPayments(): Promise<Payment[]> {
    const response = await apiClient.get<ApiResponse<Payment[]>>(
      endpoints.admin.billing.payments
    );
    return response.data.data;
  }

  /**
   * Get billing plans
   */
  async getBillingPlans(): Promise<BillingPlan[]> {
    const response = await apiClient.get<ApiResponse<BillingPlan[]>>(
      endpoints.admin.billing.plans
    );
    return response.data.data;
  }

  /**
   * Create a new billing plan
   */
  async createBillingPlan(plan: Omit<BillingPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<BillingPlan> {
    const response = await apiClient.post<ApiResponse<BillingPlan>>(
      endpoints.admin.billing.plans,
      plan
    );
    return response.data.data;
  }

  /**
   * Update a billing plan
   */
  async updateBillingPlan(id: string, plan: Partial<BillingPlan>): Promise<BillingPlan> {
    const response = await apiClient.put<ApiResponse<BillingPlan>>(
      `${endpoints.admin.billing.plans}/${id}`,
      plan
    );
    return response.data.data;
  }
}