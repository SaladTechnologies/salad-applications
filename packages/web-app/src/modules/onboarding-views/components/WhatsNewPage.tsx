import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import image from '../assets/Home - How it Works.svg'
import { OnboardingPage, Scrollbar } from '../../../components'

const styles = {
  title: {
    fontFamily: 'sharpGroteskBook25',
    textTransform: 'uppercase',
    fontSize: '14px',
    letterSpacing: '1.5px',
    lineHeight: '10px',
  },
  body: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: '12px',
    padding: '1rem 30px',

    lineHeight: '16px',
  },
}

interface Props extends WithStyles<typeof styles> {
  onNext?: () => void
  submitting?: boolean
}

class _WhatsNewPage extends Component<Props> {
  render() {
    const { submitting, onNext, classes } = this.props
    return (
      <div style={{ position: 'absolute', zIndex: 3000, top: 0, right: 0, bottom: 0, left: 0 }}>
        <OnboardingPage
          title={`What's New`}
          image={image}
          nextSubmitting={submitting}
          onNext={onNext}
          nextText={'Got It!'}
        >
          <Scrollbar>
            <div className={classes.title}>Salad Storefront</div>
            <div className={classes.body}>
              We’ve modernized, updated, and otherwise improved our rewards. With this change, we've prepared Salad for
              the future, as we can more easily house 1000s of rewards.
            </div>
            <div className={classes.title}>Salad Pay</div>
            <div className={classes.body}>
              <p>We have officially launched SaladPay within the app!</p>
              <p>
                SaladPay allows you to spend your hard earned Salad Balance on any website or app that supports
                SaladPay. Check it out when you redeem any reward in Salad. Look out for upcoming partnership
                announcements in the future.
              </p>
            </div>
          </Scrollbar>
        </OnboardingPage>
      </div>
    )
  }
}

export const WhatsNewPage = withStyles(styles)(_WhatsNewPage)
