import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Head, Scrollbar } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
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
    zIndex: 5000,
  },
  scrollContent: {
    paddingBottom: 100,
  },
})

interface Props extends WithStyles<typeof styles> {
  loadReward?: (id?: string) => void
  rewardId?: string
  reward?: Reward
  currentBalance?: number
  authenticated?: boolean
  onRedeem?: (reward?: Reward) => void
  onBack?: () => void
  isInCart?: boolean
  onAddToCart?: (reward: Reward) => void
  onRemoveFromCart?: (reward: Reward) => void
}

class _RewardDetailsPage extends Component<Props> {
  componentDidMount = () => {
    const { rewardId, loadReward } = this.props
    loadReward?.(rewardId)
  }
  render() {
    const { reward, onRedeem, onBack, classes, ...rest } = this.props
    return (
      <div className={classes.container}>
        <Head title={reward?.name} />
        <RewardHeaderBar reward={reward} onBack={onBack} onRedeem={onRedeem} {...rest} />
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
