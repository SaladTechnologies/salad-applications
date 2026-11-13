import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { rewardRequiresCoinbaseEmail } from '../coinbase'
import { VaultList } from './components/VaultList'

const mapStoreToProps = (store: RootStore): any => ({
  redemptions: store.vault.redemptions,
  // Read here, inside the observer, so the list re-renders when a reward's details load.
  coinbaseRewardIds: store.vault.redemptions
    .filter((redemption) => rewardRequiresCoinbaseEmail(store.rewards.getReward(redemption.rewardId)))
    .map((redemption) => redemption.rewardId),
  loadReward: store.rewards.ensureRewardLoaded,
  startRefresh: store.vault.startRefresh,
  stopRefresh: store.vault.stopRefresh,
})

export const VaultListContainer = connect(mapStoreToProps, VaultList)
