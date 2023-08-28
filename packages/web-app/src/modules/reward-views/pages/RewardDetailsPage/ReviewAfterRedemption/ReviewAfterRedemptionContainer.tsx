import { connect } from '../../../../../connect'
import type { RootStore } from '../../../../../Store'
import { ReviewAfterRedemption } from './ReviewAfterRedemption'

const mapStoreToProps = (store: RootStore): any => ({
  reward: store.vault.redemptions[store.vault.redemptions.length - 1],
  referralCode: store.referral.referralCode,
  onCloseClick: store.rewards.finishReview,
  onVaultLinkClick: () => store.routing.push('/store/vault'),
})

export const ReviewAfterRedemptionContainer = connect(mapStoreToProps, ReviewAfterRedemption)
