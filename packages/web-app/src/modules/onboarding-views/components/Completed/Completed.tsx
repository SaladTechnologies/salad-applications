import React, { Component } from 'react'

// styles
import { styles } from './Completed.styles'

// Assets
import image from '../../assets/Home - How it Works.svg'

// Components
import { OnboardingPage } from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  onNext: (pathname: string) => void
  earningRatePerDay: number | undefined
  rewardsOverTime: number | undefined
}

class _Completed extends Component<Props> {
  handleNext = () => {
    const { onNext } = this.props

    if (onNext) onNext('/')
  }

  render() {
    const { earningRatePerDay, rewardsOverTime, classes } = this.props

    const Elements = (
      <div className={classnames(classes.displayFlex)}>
      </div>
    )

    return (
      <OnboardingPage
        title={`Redeem your first reward!`}
        subtitle={`Salad is running and chopping away! Keep at it and in the next 24 hours you’ll be eligible for lots of goodies. Let’s get you your first reward, you’ve earned it.`}
        image={image}
        rightContent={Elements}
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
      ></OnboardingPage>
    )
  }
}

export const Completed = withStyles(styles)(_Completed)
