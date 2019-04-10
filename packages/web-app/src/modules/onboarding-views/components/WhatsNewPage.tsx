import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import image from '../assets/v020-whats-new.svg'
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
      <OnboardingPage title={'Ch-Ch-Ch-Changes'} image={image} nextSubmitting={submitting} onNext={onNext}>
        <div className={classes.title}>1. Auto-update</div>
        <div className={classes.body}>
          From now on, you won’t have to worry about having the latest build. Salad will automagically update as we
          finish up new features.
        </div>
        <div className={classes.title}>2. NEW EARNING RATES</div>
        <div className={classes.body}>
          This is a biggie. Earnings will more accurately match your GPU’s computing power. For some of you, this’ll
          mean a pretty big jump in earnings. For many, it’ll be the opposite, but hopefully not too bad, since we’ll
          still be padding your earnings.
        </div>
        <div className={classes.title}>3. reward carousel overhaul</div>
        <div className={classes.body}>
          There's a brand new look and structure for the rewards. With new filtering, we hope this'll make it easier to
          track your progress or find new rewards.
        </div>
      </OnboardingPage>
    )
  }
}

export const WhatsNewPage = withStyles(styles)(_WhatsNewPage)
