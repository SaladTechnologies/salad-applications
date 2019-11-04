import React, { Component, ReactNode } from 'react'

// Styles
import { styles } from './OnboardingHeader.styles'

// Components
import { Step, ListInline, Divider, EarningsPerDay, RewardsOverTime } from '../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {
  earningRatePerDay?: number
  rewardsOverTime?: number
}

class _OnboardingHeader extends Component<Props> {
  render() {
    const { earningRatePerDay, rewardsOverTime, classes } = this.props

    const componentList: ReactNode[] = [
      <Step active={true} complete={false} label={'1. Testing'} />,
      <Step active={false} complete={false} label={'2. Running'} />,
      <Step active={false} complete={false} label={'3. Reward'} />,
    ]

    return (
      <>
        <div className={classes.breadcrumb}>
          <ListInline componentList={componentList} splitEvenly />
        </div>
        <Divider />
        <div className={classes.earnings}>
          <EarningsPerDay className={classes.earningsPerDay} earnings={earningRatePerDay} />
          <RewardsOverTime className={classes.earningsOverTime} rewards={rewardsOverTime} hours={24} />
        </div>
        <Divider />
      </>
    )
  }
}

export const OnboardingHeader = withStyles(styles)(_OnboardingHeader)
