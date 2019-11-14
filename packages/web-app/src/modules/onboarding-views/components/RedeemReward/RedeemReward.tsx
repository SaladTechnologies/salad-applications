import React, { Component } from 'react'

// styles
import { styles } from './RedeemReward.styles'

// Assets
import image from '../../assets/Home - How it Works.svg'

// Components
import { OnboardingPage } from '../../../../components'
import { SelectedReward } from '../../../reward-views/components/SelectedReward'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { Reward } from '../../../reward/models/index'

interface Props extends WithStyles<typeof styles> {
  onNext: (pathname: string) => void
  onRewardClick: (reward: Reward) => void
  earningRatePerDay: number | undefined
  rewardsOverTime: number | undefined
  onboardingReward: Reward | undefined
}

class _RedeemReward extends Component<Props> {
  handleNext = () => {
    const { onNext } = this.props

    if (onNext) onNext('/onboarding/completed')
  }

  handleRewardClick = (reward: Reward) => {
    const { onRewardClick } = this.props

    if (onRewardClick && reward) {
      onRewardClick(reward)
    }
  }

  render() {
    const { onboardingReward, earningRatePerDay, rewardsOverTime, classes } = this.props

    const RightElements = (
      <div className={classnames(classes.selectedRewardContainer, classes.displayFlex)}>
        {onboardingReward && (
          <SelectedReward
            reward={onboardingReward}
            hideChoppingFor
            onRewardClick={() => this.handleRewardClick(onboardingReward)}
          />
        )}
      </div>
    )

    return (
      <OnboardingPage
        title={`Redeem your first reward!`}
        subtitle={`Salad is running and chopping away! Keep at it and in the next 24 hours you’ll be eligible for lots of goodies. Let’s get you your first reward, you’ve earned it.`}
        image={image}
        rightContent={RightElements}
        rightColumnWidth={'60%'}
        leftColumnPadding={'4rem 1rem 4rem 2rem'}
        rightColumnPadding={'4rem 2rem 4rem 1rem'}
        alignItems={'start'}
        display={'block'}
        onboardingHeader
        earningRatePerDay={earningRatePerDay}
        rewardsOverTime={rewardsOverTime}
        testingComplete={true}
        runningComplete={true}
        rewardActive={true}
      />
    )
  }
}

export const RedeemReward = withStyles(styles)(_RedeemReward)
