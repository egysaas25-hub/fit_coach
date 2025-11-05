export enum ReferralStatus {
  SENT = 'sent',
  JOINED = 'joined',
  REWARDED = 'rewarded',
}

export interface Referral {
  id: number;
  tenantId: number;
  referrerCustomerId: string;
  inviteCode: string;
  referredPhone: string;
  convertedSubscriptionId: number | null;
  rewardCents: number;
  status: ReferralStatus;
}