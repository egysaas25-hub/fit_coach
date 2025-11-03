// src/types/referral.ts
export type ReferralStatus = 'sent' | 'joined' | 'rewarded';

export interface Referral {
  id: number;
  tenant_id: number;
  referrer_customer_id: string;
  invite_code: string;
  referred_phone: string;
  converted_subscription_id: number | null;
  reward_cents: number;
  status: ReferralStatus;
}

export interface CreateReferralDto {
  tenant_id: number;
  referrer_customer_id: string;
  invite_code: string;
  referred_phone: string;
  status: ReferralStatus;
}

export interface UpdateReferralDto {
  status?: ReferralStatus;
  converted_subscription_id?: number | null;
  reward_cents?: number;
}