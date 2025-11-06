// lib/mappers/subscription.mapper.ts
import { Subscription, SubscriptionPlan, Invoice, Payment, BillingCycle, PaymentStatus } from '@/types/domain/subscription';

interface RawSubscription {
  subscription_id: string;
  client_id: string;
  plan_id: string;
  amount: number;
  status: string;
  next_billing: string;
  start_date: string;
  created_at: string;
  updated_at: string;
}

interface RawSubscriptionPlan {
  plan_id: string;
  name: string;
  price: number;
  active_count: number;
  billing_cycle: string;
}

interface RawInvoice {
  invoice_id: string;
  subscription_id: string;
  amount: number;
  status: string;
  issued_at: string;
  due_at: string;
}

interface RawPayment {
  payment_id: string;
  subscription_id: string;
  amount: number;
  status: string;
  processed_at: string;
}

export class SubscriptionMapper {
  static toDomainSubscription(raw: RawSubscription): Subscription {
    return {
      id: raw.subscription_id,
      clientId: raw.client_id,
      planId: raw.plan_id,
      amount: raw.amount,
      status: raw.status as PaymentStatus,
      nextBilling: raw.next_billing,
      startDate: raw.start_date,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }

  static toDomainSubscriptions(rawSubscriptions: RawSubscription[]): Subscription[] {
    return rawSubscriptions.map(this.toDomainSubscription);
  }

  static toDomainPlan(raw: RawSubscriptionPlan): SubscriptionPlan {
    return {
      id: raw.plan_id,
      name: raw.name,
      price: raw.price,
      activeCount: raw.active_count,
      billingCycle: raw.billing_cycle as BillingCycle,
    };
  }

  static toDomainPlans(rawPlans: RawSubscriptionPlan[]): SubscriptionPlan[] {
    return rawPlans.map(this.toDomainPlan);
  }

  static toDomainInvoice(raw: RawInvoice): Invoice {
    return {
      id: raw.invoice_id,
      subscriptionId: raw.subscription_id,
      amount: raw.amount,
      status: raw.status as PaymentStatus,
      issuedAt: raw.issued_at,
      dueAt: raw.due_at,
    };
  }

  static toDomainInvoices(rawInvoices: RawInvoice[]): Invoice[] {
    return rawInvoices.map(this.toDomainInvoice);
  }

  static toDomainPayment(raw: RawPayment): Payment {
    return {
      id: raw.payment_id,
      subscriptionId: raw.subscription_id,
      amount: raw.amount,
      status: raw.status as PaymentStatus,
      processedAt: raw.processed_at,
    };
  }

  static toDomainPayments(rawPayments: RawPayment[]): Payment[] {
    return rawPayments.map(this.toDomainPayment);
  }
}