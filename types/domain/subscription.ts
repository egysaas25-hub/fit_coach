// types/domain/subscription.ts
export interface Subscription {
  id: string;
  clientId: string;
  planId: string;
  amount: number;
  status: PaymentStatus;
  nextBilling: string; // ISO date string
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string; // e.g., 'Premium Monthly'
  price: number;
  activeCount: number;
  billingCycle: BillingCycle;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  status: PaymentStatus;
  issuedAt: string;
  dueAt: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  status: PaymentStatus;
  processedAt: string;
}

export enum BillingCycle {
  Monthly = 'Monthly',
  Annual = 'Annual',
}

export enum PaymentStatus {
  Active = 'Active',
  Cancelled = 'Cancelled',
  PastDue = 'Past Due',
}