import React, { Component } from 'react'

// styles
import { styles } from './MachineTest.styles'

// Assets
import image from '../../assets/Home - How it Works.svg'

// Components
import { OnboardingPage } from '../../../../components'
import { PhraseViewer, PhraseType, Button, ErrorText } from '../../../../components'
import { TestResult } from '../../../../components/elements/TestResults/TestResult'
// import { PluginInfo } from '../../../salad-bowl/models/PluginInfo'
// import { ErrorMessage } from '../../../salad-bowl/models'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  onTestMachine: () => void
  onAbortTest: () => void
  onRestartTest: () => void
  onNext: (pathname: string) => void
  pluginName: string
  pluginStatus: string
  errorCategory: string | undefined
  errorMessage: string | undefined
  installPath: string | undefined
  earningRatePerDay: number | undefined
  rewardsOverTime: number | undefined
}

class _MachineTest extends Component<Props> {
  state = {
    togglePhraseViewer: false,
    // toggleTestResults: false,
    // toggleTestButton: true,
  }

  handleTestMachine = () => {
    this.setState({
      togglePhraseViewer: !this.state.togglePhraseViewer,
    })

    const { onTestMachine } = this.props

    if (onTestMachine) onTestMachine()
  }

  handleAbortTest = () => {
    this.setState({
      togglePhraseViewer: !this.state.togglePhraseViewer,
    })

    const { onAbortTest } = this.props

    if (onAbortTest) onAbortTest()
  }

  handleRestartTest = () => {
    this.setState({
      togglePhraseViewer: !this.state.togglePhraseViewer,
    })

    const { onRestartTest } = this.props

    if (onRestartTest) onRestartTest()
  }

  handleNext = () => {
    const { onNext } = this.props

    if (onNext) onNext('/onboarding/running')
  }

  render() {
    const {
      pluginName,
      pluginStatus,
      errorCategory,
      errorMessage,
      installPath,
      earningRatePerDay,
      rewardsOverTime,
      classes,
    } = this.props

    const Elements = (
      <>
        {!this.state.togglePhraseViewer && !errorCategory && (
          <>
            <Button uppercase onClick={this.handleTestMachine} className={classnames(classes.startTestBtn)}>
              Start test
            </Button>
            <ErrorText className={classes.errorText}>
              Heads up Chef-to-be! Your antivirus may be set off due to Salad downloading and testing the miner.
            </ErrorText>
          </>
        )}

        {this.state.togglePhraseViewer && (
          <>
            <PhraseViewer phraseType={PhraseType.all} phraseDelay={5000} />

            <div className={classes.stopTest}>
              <Button uppercase onClick={this.handleAbortTest} className={classnames(classes.stopTestBtn)}>
                Stop test
              </Button>
            </div>
          </>
        )}

        {(pluginStatus === 'running' || errorCategory) && (
          <>
            <TestResult
              pluginName={pluginName}
              pluginStatus={pluginStatus}
              errorCategory={errorCategory}
              errorMessage={errorMessage}
              installPath={installPath}
            />

            {errorCategory && (
              <Button
                uppercase
                onClick={this.handleRestartTest}
                className={classnames(classes.startTestBtn, classes.marginTop, {
                  [classes.runTestLaterBtn]: errorCategory !== 'antiVirus' && errorCategory !== 'driver',
                })}
              >
                {errorCategory === 'antiVirus' || errorCategory === 'driver' ? 'Test again' : 'Run test later'}
              </Button>
            )}

            {pluginStatus === 'running' && (
              <Button
                uppercase
                onClick={this.handleNext}
                className={classnames(classes.startTestBtn, classes.marginTop, {
                  [classes.runTestLaterBtn]: errorCategory !== 'antiVirus' && errorCategory !== 'driver',
                })}
              >
                Next
              </Button>
            )}
          </>
        )}
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
        testingActive={true}
      ></OnboardingPage>
    )
  }
}

export const MachineTest = withStyles(styles)(_MachineTest)
