import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { RedeemReward } from './components/RedeemReward/RedeemReward'

const mapStoreToProps = (store: RootStore) => {
  if (!store.rewards.onboardingReward) {
    store.rewards.setOnboardingReward()
  }

  return {
    onNext: store.profile.onNext,
    onRewardClick: store.rewards.viewReward,
    onboardingReward: store.rewards.onboardingReward,

    earningRatePerDay: store.profile.earningRatePerDay,
    rewardsOverTime: store.profile.rewardsOverTime,
    onboardingRedeemed: store.rewards.onboardingRedeemed,
  }
}

export const RedeemRewardContainer = connect(mapStoreToProps, RedeemReward)
