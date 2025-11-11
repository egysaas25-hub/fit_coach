// types/domain/billing.ts
export interface Subscription {
  id: string;
  clientId: string;
  planId: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  nextBillingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  clientId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
  issuedDate: Date;
  dueDate: Date;
  paidDate?: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  processedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}