import { useExternalState } from '../../app/external-state.ts'
import type { RootStore } from '../../Store'
import { rewardRequiresCoinbaseEmail } from '../coinbase'
import type { RewardState } from '../reward'
import type { RewardVaultItem } from '../vault/models'
import { VaultList } from './components/VaultList'
import { useVaultRefresh } from '../../rewards/vault.ts'
import { useStore } from '../../Store'

const mapStoreToProps = (store: RootStore, props: { redemptions: RewardVaultItem[]; rewards: RewardState }): any => ({
  redemptions: props.redemptions,
  // Read from the reward cache passed down, so the list re-renders when a reward's details load.
  coinbaseRewardIds: props.redemptions
    .filter((redemption) => rewardRequiresCoinbaseEmail(props.rewards.rewards.get(redemption.rewardId)))
    .map((redemption) => redemption.rewardId),
  loadReward: store.rewards.ensureRewardLoaded,
})

/** The reward vault page, refreshed while it is open. */
export const VaultListContainer = () => {
  const store = useStore()
  const { vault, rewards } = store
  useVaultRefresh(vault.refresh)
  return (
    <VaultList
      {...mapStoreToProps(store, {
        redemptions: useExternalState(vault.state).redemptions,
        rewards: useExternalState(rewards.state),
      })}
    />
  )
}
