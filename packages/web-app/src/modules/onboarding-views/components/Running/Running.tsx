import React, { Component, ReactNode } from 'react'

// styles
import { styles } from './Running.styles'

// Assets
import image from '../../assets/Home - How it Works.svg'

// Components
import { OnboardingPage } from '../../../../components'
import { P, ListUnstyled, MiningStatus } from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
// import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  earningRatePerDay: number | undefined
  rewardsOverTime: number | undefined
}

class _Running extends Component<Props> {
  render() {
    const { earningRatePerDay, rewardsOverTime, classes } = this.props

    const list: ReactNode[] = [
      <MiningStatus label={'Initializing - First step! Salad is detecting your hashrate.'} completed={true} />,
      <MiningStatus label={'Running - Salad detected a hashrate and is trying to submit a share.'} completed={true} />,
      <MiningStatus label={'Earning - Salad is successfully submitting shares. You should see your balance rising.'} completed={false} />,
    ]

    const LeftElements = (
      <>
        <ListUnstyled componentList={list} />
      </>
    )
    const RightElements = (
      <>
        <P className={classes.deleteme}>
          FOO!!!
        </P>
      </>
    )

    return (
      <OnboardingPage
        title={`How Running Salad Works`}
        image={image}
        leftContent={LeftElements}
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
        runningActive={true}
      ></OnboardingPage>
    )
  }
}

export const Running = withStyles(styles)(_Running)
