export interface CreateReferralDto {
  tenant_id: number;
  referrer_customer_id: string;
  invite_code: string;
  referred_phone: string;
  status: string;
}

export interface UpdateReferralDto {
  status?: string;
  converted_subscription_id?: number | null;
  reward_cents?: number;
}

export interface ReferralResponseDto {
  id: number;
  tenant_id: number;
  referrer_customer_id: string;
  invite_code: string;
  referred_phone: string;
  converted_subscription_id: number | null;
  reward_cents: number;
  status: string;
}