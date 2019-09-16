import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import image from '../assets/Home - How it Works.svg'
import { OnboardingPage } from '../../../components'

const styles = (theme: SaladTheme) => ({
  title: {
    fontFamily: 'sharpGroteskBook25',
    textTransform: 'uppercase',
    fontSize: '10px',
    letterSpacing: '1.5px',
    lineHeight: '10px',
  },
  body: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: '12px',
    padding: '1rem 0',
    lineHeight: '16px',
  },
})

interface Props extends WithStyles<typeof styles> {
  onNext?: () => void
  submitting?: boolean
}

class _WhatsNewPage extends Component<Props> {
  render() {
    const { submitting, onNext, classes } = this.props
    return (
      <OnboardingPage title={`What's New`} image={image} nextSubmitting={submitting} onNext={onNext}>
        <div className={classes.title}>1. Referral Codes</div>
        <div className={classes.body}>Each user now has their own unique, static referral code.</div>
        <div className={classes.title}>2. Usernames</div>
        <div className={classes.body}>Users can now create custom usernames with up to 32 characters.</div>
        <div className={classes.title}>3. New Earnings</div>
        <div className={classes.body}>
          The app now displays three different stages of earning:
          <p>
            <i>Initializing</i> - once “Start” is pressed, your app will stay in this phase until we detect your
            hashrate.
          </p>
          <p>
            <i>Running</i> - after we detect your hashrate, you’ll be “chopping” until you start submitting shares.
          </p>
          <p>
            <i>Earning</i> - after we verify your successful submission of a share,
          </p>
          <p>
            your hard coded earning rate will be displayed.If you don’t have an active earning rate, your balance will
            not tick up.
          </p>
        </div>
        <div className={classes.title}>4. Auto-Launch</div>
        <div className={classes.body}>After login Salad will automatically open. You can turn this feature off in settings.</div>
      </OnboardingPage>
    )
  }
}

export const WhatsNewPage = withStyles(styles)(_WhatsNewPage)
