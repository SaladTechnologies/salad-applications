import React, { Component } from 'react'

// styles
import { styles } from './Completed.styles'

// Assets
import image from '../../assets/Home - How it Works.svg'

// Components
import { OnboardingPage, Button } from '../../../../components'

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
        <div className={classes.nextButtonContainer}>
          <Button
            uppercase
            onClick={this.handleNext}
            className={classnames(classes.startTestBtn, classes.marginTop, classes.pullRight)}
          >
            Finish
          </Button>
        </div>
      </div>
    )

    return (
      <OnboardingPage
        title={`WAHOOO!`}
        subtitle={`You're a bonafide Salad chef now, feels good doesn't it? Checkout our new referral system to see how you can unlock bonus earnings and our rewards carousel to see what prize you'll want to redeem next!`}
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
        rewardComplete={true}
      ></OnboardingPage>
    )
  }
}

export const Completed = withStyles(styles)(_Completed)
