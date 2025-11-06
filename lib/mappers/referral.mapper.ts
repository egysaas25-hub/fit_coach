import { ReferralResponseDto, CreateReferralDto } from '@/types/api/referral.dto';
import { Referral, ReferralStatus } from '@/types/models/referral.model';

export const referralMapper = {
  toModel: (dto: ReferralResponseDto): Referral => ({
    id: dto.id,
    tenantId: dto.tenant_id,
    referrerCustomerId: dto.referrer_customer_id,
    inviteCode: dto.invite_code,
    referredPhone: dto.referred_phone,
    convertedSubscriptionId: dto.converted_subscription_id,
    rewardCents: dto.reward_cents,
    status: dto.status as ReferralStatus,
  }),
  toCreateDto: (model: Partial<Referral>): CreateReferralDto => ({
    tenant_id: model.tenantId!,
    referrer_customer_id: model.referrerCustomerId!,
    invite_code: model.inviteCode!,
    referred_phone: model.referredPhone!,
    status: model.status!,
  }),
};