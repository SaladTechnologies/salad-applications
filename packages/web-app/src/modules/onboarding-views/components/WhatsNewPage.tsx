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
      <OnboardingPage title={'#SENDLOGS'} image={image} nextSubmitting={submitting} onNext={onNext}>
        <div className={classes.title}>1. Share Tracking</div>
        <div className={classes.body}>
          Share Tracking remains an included feature and we’re hard at work in optimizing this experience. 
        </div>
        <div className={classes.title}>2. Improved Mining</div>
        <div className={classes.body}>
          Salad now offers new notifications that inform you if the miner is not working properly with your current hardware and how to resolve those issues.
        </div>
        <div className={classes.title}>3. Send Logs</div>
        <div className={classes.body}>
          Additionally, we have a new “Send Logs” button included in the app which automatically sends Salad your logs when you run into bugs or other issues.
        </div>
      </OnboardingPage>
    )
  }
}

export const WhatsNewPage = withStyles(styles)(_WhatsNewPage)
