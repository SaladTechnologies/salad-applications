import React, { Component } from 'react'

// styles
import { styles } from './Running.styles'

// Assets
import image from '../../assets/Home - How it Works.svg'

// Components
import { OnboardingPage } from '../../../../components'
import {
  P
} from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
// import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  earningRatePerDay?: number
  rewardsOverTime?: number
}

class _Running extends Component<Props> {
  render() {
    const { earningRatePerDay, rewardsOverTime, classes } = this.props

    const Elements = (
      <>
        <P className={classes.deleteme}>
          FOO!!!
        </P>
      </>
    )

    return (
      <OnboardingPage
        title={`Let's Get Started`}
        subtitle={`Salad is checking out your machine and deciding how to optimize your earnings and experience.`}
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
      ></OnboardingPage>
    )
  }
}

export const Running = withStyles(styles)(_Running)
