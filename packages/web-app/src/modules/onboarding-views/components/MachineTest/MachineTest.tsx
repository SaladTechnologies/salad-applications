import React, { Component, ReactNode } from 'react'

// styles
import { styles } from './MachineTest.styles'

// Assets
import image from '../../assets/Home - How it Works.svg'

// Components
import { OnboardingPage } from '../../../../components'
import {
  Step,
  ListInline,
  Divider,
  PhraseViewer,
  PhraseType,
  Button,
  ErrorText,
  RewardsOverTime,
  EarningsPerDay,
} from '../../../../components'
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
  pluginName: string
  pluginStatus: string
  errorCategory?: string
  errorMessage?: string
  installPath?: string
  earningRatePerDay?: number
  rewardsOverTime?: number
}

class _MachineTest extends Component<Props> {
  state = {
    togglePhraseViewer: false,
    toggleTestResults: false,
    toggleTestButton: true,
  }

  handleTestMachine = () => {
    this.setState({
      togglePhraseViewer: true,
      toggleTestButton: false,
      toggleTestResults: false,
    })

    const { onTestMachine } = this.props

    if (onTestMachine) onTestMachine()
  }

  handleAbortTest = () => {
    this.setState({
      togglePhraseViewer: false,
      toggleTestButton: true,
      toggleTestResults: false,
    })

    const { onAbortTest } = this.props

    if (onAbortTest) onAbortTest()
  }

  handleRestartTest = () => {
    this.setState({
      togglePhraseViewer: false,
      toggleTestButton: true,
      toggleTestResults: false,
    })

    const { onRestartTest } = this.props

    if (onRestartTest) onRestartTest()
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

    const componentList: ReactNode[] = [
      <Step active={true} complete={false} label={'1. Testing'} />,
      <Step active={false} complete={false} label={'2. Running'} />,
      <Step active={false} complete={false} label={'3. Reward'} />,
    ]

    const Elements = (
      <>
        <div className={classes.breadcrumb}>
          <ListInline componentList={componentList} splitEvenly />
        </div>
        <Divider />
        <div className={classes.earnings}>
          <EarningsPerDay className={classes.earningsPerDay} earnings={earningRatePerDay} />
          <RewardsOverTime className={classes.earningsOverTime} rewards={rewardsOverTime} hours={24} />
        </div>
        <Divider />
        <div className={'testing'}>
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

          {this.state.toggleTestButton && (
            <>
              <Button uppercase onClick={this.handleTestMachine} className={classnames(classes.startTestBtn)}>
                Start test
              </Button>
              <ErrorText className={classes.errorText}>
                Heads up Chef-to-be! Your antivirus may be set off due to Salad downloading and testing the miner.
              </ErrorText>
            </>
          )}

          {pluginStatus === 'running' && (
            <h1>HELLO WORLD</h1>
          )}

          {/* {pluginStatus === 'stopped' && ( */}
          {this.state.toggleTestResults && (
            <>
              <TestResult
                pluginName={pluginName}
                pluginStatus={pluginStatus}
                errorCategory={errorCategory}
                errorMessage={errorMessage}
                installPath={installPath}
              />

              {errorCategory === 'antiVirus' && (
                <Button
                  uppercase
                  onClick={this.handleRestartTest}
                  className={classnames(classes.startTestBtn, classes.marginTop)}
                >
                  Test again
                </Button>
              )}
            </>
          )}
        </div>
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
      ></OnboardingPage>
    )
  }
}

export const MachineTest = withStyles(styles)(_MachineTest)
