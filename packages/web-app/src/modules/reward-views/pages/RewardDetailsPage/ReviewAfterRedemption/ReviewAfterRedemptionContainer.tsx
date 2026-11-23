import type { RootStore } from '../../../../../Store'
import { useStore } from '../../../../../Store'
import type { Navigation } from '../../../../../routing/navigation.ts'
import { useNavigation } from '../../../../../routing/navigation-context.ts'
import type { RewardVaultItem } from '../../../../vault/models'
import { ReviewAfterRedemption } from './ReviewAfterRedemption'

/** The latest redemption, which the reward page's container reads from the vault. */
interface OwnProps {
  reward: RewardVaultItem | undefined
}

const mapStoreToProps = (store: RootStore, navigation: Navigation, props: OwnProps): any => ({
  reward: props.reward,
  onCloseClick: store.rewards.finishReview,
  onVaultLinkClick: () => navigation.push('/store/vault'),
})

/** The review after a redemption, which closes the review or goes to the vault. */
export const ReviewAfterRedemptionContainer = (props: OwnProps) => (
  <ReviewAfterRedemption {...mapStoreToProps(useStore(), useNavigation(), props)} />
)
