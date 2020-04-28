import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import image from '../assets/GPUs.svg'
import { OnboardingPage, SmartLink } from '../../../components'
import { LoadingPage } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {},
  subtext: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.medium,
  },
  gpuList: {
    padding: '1rem 0',
  },
  gpuTitle: {
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.mediumLarge,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  detailsTitle: {
    fontFamily: 'sharpGroteskBook25',
    fontSize: theme.small,
    lineHeight: '10px',
    letterSpacing: '1.25px',
  },
  detailsText: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.medium,
    lineHeight: '2rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  onNext?: () => void
  isChecking?: boolean
  validGPUs?: boolean
  validOS?: boolean
  gpuList?: string[]
}

class _CompatibilityCheckPage extends Component<Props> {
  handleNext = () => {
    const { onNext } = this.props

    if (onNext) {
      onNext()
    }
  }
  render() {
    const { isChecking, validGPUs, validOS, gpuList, classes } = this.props

    if (isChecking) {
      return <LoadingPage text="Checking Machine Compatibility" />
    }

    if (!validOS) {
      return (
        <OnboardingPage
          title={'Some Windows are doors.'}
          subtitle={`Looks like you're running a version of Windows that doesn't like Salad.`}
          image={image}
          nextText={'GOT IT'}
          onNext={this.handleNext}
        >
          <div className={classes.subtext}>
            We fully support Windows 7 and 10. Proceed with caution if you want to avoid upgrading to a compatible
            version of Windows.
          </div>
        </OnboardingPage>
      )
    }

    if (!validGPUs) {
      return (
        <OnboardingPage
          title={`Your machine doesn't have the chops.`}
          subtitle={'Looks like your GPU is incompatible with Salad:'}
          image={image}
          nextText={'GOT IT'}
          onNext={this.handleNext}
        >
          <div>
            <div className={classes.gpuList}>
              {gpuList &&
                gpuList.map((x, index) => (
                  <div key={index} className={classes.gpuTitle}>
                    {x}
                  </div>
                ))}
            </div>
            <div style={{ padding: '1rem 0' }}>
              <div className={classes.detailsTitle}>THE BAD NEWS</div>
              <div className={classes.detailsText}>
                We didn't detect any supported GPUs. If you're sure you have one of our supported cards, please let us
                know.
              </div>
              <div className={classes.detailsText}>You can also head over to our FAQ to find out more.</div>
            </div>
            <div style={{ padding: '1rem 0' }}>
              <div className={classes.detailsTitle}>THE GOOD NEWS</div>
              <div className={classes.detailsText}>
                You can still earn Salad Balance by referring people who have a qualifying GPU, or by completing tasks
                on one of the <SmartLink to="/earn/offerwall">available offerwalls</SmartLink>.
              </div>
            </div>
          </div>
        </OnboardingPage>
      )
    }

    return null
  }
}

export const CompatibilityCheckPage = withStyles(styles)(_CompatibilityCheckPage)
