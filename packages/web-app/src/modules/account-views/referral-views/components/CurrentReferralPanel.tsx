import type { Referral } from '../../../referral/models'
import { CurrentReferralProgress } from './CurrentReferralProgress'

interface Props {
  referral?: Referral
}

export const CurrentReferralPanel = ({ referral }: Props) =>
  referral?.referralDefinition && <CurrentReferralProgress referral={referral} />
