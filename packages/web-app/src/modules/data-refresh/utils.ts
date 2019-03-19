import { ReferralResource } from '../referral/models/ReferralResource'
import { Referral } from '../referral/models'

export const referralFromResource = (r: ReferralResource): Referral => ({
  id: String(r.referralId),
  status: String(r.status),
  username: String(r.email),
  balanceReward: Number(r.balanceReward),
})
