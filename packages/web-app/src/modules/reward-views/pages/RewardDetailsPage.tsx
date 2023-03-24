import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Head, Scrollbar } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import type { Reward } from '../../reward/models'
import {
  RewardDescriptionPanel,
  RewardDisclaimers,
  RewardHeaderBar,
  RewardHowToPanel,
  RewardImageCarousel,
  RewardInfoPanel,
  RewardRequirementsPanel,
} from '../components'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.darkBlue,
    color: theme.lightGreen,
  },
  scrollContent: {
    paddingBottom: 100,
  },
})

interface Props extends WithStyles<typeof styles> {
  rewardId?: string
  reward?: Reward
  currentBalance?: number
  authenticated?: boolean
  requiresMinecraftUsername: boolean
  requiresSaladCard: boolean
  requiresPayPalAccount: boolean
  isTargetReward: boolean
  loadReward?: (id?: string) => void
  onRedeem?: (reward?: Reward) => void
  onBack?: () => void
  onRemoveTargetRewardClick: () => void
  trackDisabledBuyNowClick: () => void
  onTargetThisRewardClick: (reward: Reward) => void
}

class _RewardDetailsPage extends Component<Props> {
  public override componentDidMount = () => {
    const { rewardId, loadReward } = this.props
    loadReward?.(rewardId)
  }

  public override render(): ReactNode {
    const {
      reward,
      onRedeem,
      onBack,
      requiresMinecraftUsername,
      requiresPayPalAccount,
      requiresSaladCard,
      isTargetReward,
      trackDisabledBuyNowClick,
      onTargetThisRewardClick,
      onRemoveTargetRewardClick,
      classes,
      ...rest
    } = this.props
    return (
      <div className={classes.container}>
        <Head title={reward?.name} />
        <RewardHeaderBar
          reward={reward}
          onBack={onBack}
          onRedeem={onRedeem}
          requiresMinecraftUsername={requiresMinecraftUsername}
          requiresPayPalAccount={requiresPayPalAccount}
          requiresSaladCard={requiresSaladCard}
          isTargerReward={isTargetReward}
          onTargetThisRewardClick={onTargetThisRewardClick}
          onRemoveTargetRewardClick={onRemoveTargetRewardClick}
          trackDisabledBuyNowClick={trackDisabledBuyNowClick}
          {...rest}
        />
        <Scrollbar>
          <div className={classes.scrollContent}>
            <RewardImageCarousel reward={reward} />
            <RewardInfoPanel reward={reward} />
            <RewardHowToPanel reward={reward} {...rest} />
            <RewardDescriptionPanel reward={reward} />
            <RewardRequirementsPanel reward={reward} />
            <RewardDisclaimers />
          </div>
        </Scrollbar>
      </div>
    )
  }
}

export const RewardDetailsPage = withStyles(styles)(_RewardDetailsPage)
