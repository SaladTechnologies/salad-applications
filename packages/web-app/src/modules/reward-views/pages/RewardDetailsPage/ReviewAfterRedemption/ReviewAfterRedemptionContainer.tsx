import type { RootStore } from '../../../../../Store'
import { useStore } from '../../../../../Store'
import type { RewardVaultItem } from '../../../../vault/models'
import { ReviewAfterRedemption } from './ReviewAfterRedemption'

/** The latest redemption, which the reward page's container reads from the vault. */
interface OwnProps {
  reward: RewardVaultItem | undefined
}

const mapStoreToProps = (store: RootStore, props: OwnProps): any => ({
  reward: props.reward,
  onCloseClick: store.rewards.finishReview,
  onVaultLinkClick: () => store.routing.push('/store/vault'),
})

/** The review after a redemption, which closes the review or goes to the vault. */
export const ReviewAfterRedemptionContainer = (props: OwnProps) => (
  <ReviewAfterRedemption {...mapStoreToProps(useStore(), props)} />
)
