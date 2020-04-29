import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import {
  RewardHeaderBar,
  RewardImageCarousel,
  RewardInfoPanel,
  RewardDescriptionPanel,
  RewardRequirementsPanel,
  RewardDisclaimers,
} from '../components'
import { Scrollbars } from 'react-custom-scrollbars'

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
  reward?: Reward
  onRedeem?: (reward?: Reward) => void
  onBack?: () => void
  isInCart?: boolean
  onAddToCart?: (reward: Reward) => void
  onRemoveFromCart?: (reward: Reward) => void
}

class _RewardDetailsPage extends Component<Props> {
  render() {
    const { reward, onRedeem, onBack, classes, ...rest } = this.props

    return (
      <div className={classes.container}>
        <RewardHeaderBar reward={reward} onBack={onBack} onRedeem={onRedeem} {...rest} />
        <Scrollbars>
          <div className={classes.scrollContent}>
            <RewardImageCarousel reward={reward} />
            <RewardInfoPanel reward={reward} />
            <RewardDescriptionPanel reward={reward} />
            <RewardRequirementsPanel reward={reward} />
            <RewardDisclaimers />
          </div>
        </Scrollbars>
      </div>
    )
  }
}

export const RewardDetailsPage = withStyles(styles)(_RewardDetailsPage)
