import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { rewardRequiresCoinbaseEmail } from '../coinbase'
import { VaultList } from './components/VaultList'
import { useVaultRefresh } from '../../rewards/vault.ts'
import { getStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => ({
  redemptions: store.vault.redemptions,
  // Read here, inside the observer, so the list re-renders when a reward's details load.
  coinbaseRewardIds: store.vault.redemptions
    .filter((redemption) => rewardRequiresCoinbaseEmail(store.rewards.getReward(redemption.rewardId)))
    .map((redemption) => redemption.rewardId),
  loadReward: store.rewards.ensureRewardLoaded,
})

const ConnectedVaultList = connect(mapStoreToProps, VaultList)

/** The reward vault page, refreshed while it is open. */
export const VaultListContainer = () => {
  useVaultRefresh(getStore().vault.refresh)
  return <ConnectedVaultList />
}
