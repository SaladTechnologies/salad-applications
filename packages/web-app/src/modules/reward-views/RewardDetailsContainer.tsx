import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { CoinbaseEmailState } from '../../account/coinbase-email.ts'
import { useCoinbaseEmailState } from '../../account/coinbase-email.ts'
import type { Profile } from '../../account/profile.ts'
import type { SolanaWalletState } from '../../account/solana-wallet.ts'
import { useSolanaWalletState } from '../../account/solana-wallet.ts'
import { useProfile } from '../../account/profile.ts'
import { connect } from '../../connect'
import { useHttp } from '../../data/http-context.ts'
import { isSignedIn, useSession } from '../../data/session.ts'
import { fetchRewardResource, rewardQueryKey } from '../../rewards/reward.ts'
import { isStorefrontOutdated, storefrontQueryKey } from '../../rewards/storefront.ts'
import { useNavigation } from '../../routing/navigation-context.ts'
import type { RootStore } from '../../Store'
import { getStore } from '../../Store'
import type { Reward } from '../reward/models'
import type { RewardResource } from '../reward/models/RewardResource'
import { rewardFromResource } from '../reward/utils'
import { RewardDetailsPage } from './pages'

interface OwnProps {
  match: { params: { id: string } }
  onBack: () => void
  /** The signed-in user's profile, which says whether a Minecraft reward still needs a username. */
  profile: Profile | undefined
  /** Whether the user is signed in: `undefined` until it is known. */
  isAuthenticated: boolean | undefined
  /** The saved Solana wallet address, which a RENDER reward needs before it can be redeemed. */
  solanaWallet: SolanaWalletState
  /** The saved Coinbase email, which a Coinbase reward needs before it can be redeemed. */
  coinbaseEmail: CoinbaseEmailState
}

const mapStoreToProps = (store: RootStore, props: OwnProps): any => {
  const onRedeem = (reward: Reward) => {
    store.analytics.trackButtonClicked('buy_now', 'Buy Now', 'enabled')
    store.rewards.redeemReward(reward)
  }

  const trackDisabledBuyNowClick = () => {
    store.analytics.trackButtonClicked('buy_now', 'Buy Now', 'disabled')
  }

  const extensions = props.profile?.extensions
  // The store's copy, which the query fills: redemption, SaladPay, and the target-reward refresh share it.
  const reward = store.rewards.getReward(props.match.params.id)
  const requiresMinecraftUsername =
    reward?.tags?.includes('requires-minecraft-username') && !extensions?.minecraftUsername
  const isRewardSelectedAsTarget = store.rewards.selectedTargetReward?.id === reward?.id

  return {
    authenticated: props.isAuthenticated,
    rewardId: props.match.params.id,
    currentBalance: store.balance.currentBalance,
    reward: reward,
    isReviewing: store.rewards.isReviewing,
    onBack: props.onBack,
    onRedeem,
    onTargetThisRewardClick: store.rewards.setSelectedTargetReward,
    onRemoveTargetRewardClick: store.rewards.removeSelectedTargetReward,
    isTargetReward: isRewardSelectedAsTarget,
    requiresMinecraftUsername: requiresMinecraftUsername,
    solanaWalletAddress: props.solanaWallet.walletAddress,
    isSolanaWalletLoading: props.solanaWallet.isLoading,
    loadSolanaWallet: store.solanaWallet.loadWallet,
    coinbaseEmail: props.coinbaseEmail.email,
    isCoinbaseEmailLoading: props.coinbaseEmail.isLoading,
    isCoinbaseEmailLoadError: props.coinbaseEmail.isLoadError,
    loadCoinbaseEmail: store.coinbaseEmail.loadEmail,
    trackDisabledBuyNowClick,
  }
}

const ConnectedRewardDetails = connect(mapStoreToProps, RewardDetailsPage)

/**
 * A reward's page. It fetches the reward on each visit and tracks the view, as the page did through the store. The
 * fetched reward also goes into the store's reward cache, which redemption and SaladPay read, and a storefront that
 * shows a different price or quantity is fetched again.
 */
export const RewardDetailsContainer = ({
  match,
  backFallback,
}: {
  match: { params: { id: string } }
  backFallback: string
}) => {
  const http = useHttp()
  const queryClient = useQueryClient()
  const navigation = useNavigation()
  const { id } = match.params
  useQuery({
    queryKey: rewardQueryKey(id),
    queryFn: async (): Promise<Reward> => {
      const loaded = rewardFromResource((await fetchRewardResource(http, id)) as RewardResource)
      const store = getStore()
      store.rewards.setReward(loaded)
      store.analytics.trackRewardView(loaded)
      if (isStorefrontOutdated(queryClient.getQueryData(storefrontQueryKey), loaded)) {
        void queryClient.invalidateQueries({ queryKey: storefrontQueryKey })
      }
      return loaded
    },
    enabled: id !== '',
  })
  return (
    <ConnectedRewardDetails
      match={match}
      onBack={() => navigation.goBackOr(backFallback)}
      profile={useProfile()}
      isAuthenticated={isSignedIn(useSession())}
      solanaWallet={useSolanaWalletState(getStore().solanaWallet)}
      coinbaseEmail={useCoinbaseEmailState(getStore().coinbaseEmail)}
    />
  )
}
