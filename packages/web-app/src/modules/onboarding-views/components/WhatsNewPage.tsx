import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { OnboardingPage, Scrollbar, SmartLink } from '../../../components'
import image from '../assets/Home - How it Works.svg'

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
            <div className={classes.title}>Dynamic Earnings</div>
            <div className={classes.body}>
              Salad payouts are now determined by how much your machine actually contributes to any of the many
              blockchain protocols we support. So long earning tables!!
            </div>
            <div className={classes.body}>
              Learn more by reading our{' '}
              <SmartLink to="https://medium.com/@saladchefs/the-salad-guide-to-dynamic-earnings-e6e81edba726">
                Guide to Dynamic Earnings
              </SmartLink>
            </div>

            <div className={classes.body}>
              Features include:
              <li>New mining statuses</li>
              <li>New earning history table</li>
              <li>Updates to XP</li>
              <li>The Pantry</li>
            </div>
          </Scrollbar>
        </OnboardingPage>
      </div>
    )
  }
}

export const WhatsNewPage = withStyles(styles)(_WhatsNewPage)
