import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SmartLink, P, Divider, SectionHeader, Scrollbar, Head } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { StartButtonContainer } from '../../machine-views'
import { DesktopDownloadContainer } from '../DesktopDownloadContainer'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: theme.lightGreen,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexBasis: '50%',
  },
  startContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _MiningInformation extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <Head title="Mining - How it Works" />
        <Scrollbar>
          <div className={classes.content}>
            <DesktopDownloadContainer />
            <div className={classes.splitContainer}>
              <div className={classes.column} style={{ paddingRight: 20 }}>
                <SectionHeader>What is Mining?</SectionHeader>
                <P>
                  Mining powers the world of cryptocurrency, individual miners (computers) form vast networks of shared
                  processing power to keep networks like Ethereum and Bitcoin running. In exchange for this work, miners
                  get paid in the cryptocurrency their machine supports. Salad makes this process simple - just click
                  start and you'll begin earning Salad balance, we'll take care of the rest.
                </P>
              </div>
              <div className={classes.column}></div>
            </div>
            <Divider />
            <SectionHeader>Getting Started</SectionHeader>
            <div className={classes.splitContainer}>
              <div className={classes.column}>
                <P>
                  Mining is easy, simply press the "Start" button and Salad will automatically start mining for you. In
                  many cases it will take your machine some time to get to the "Chopping" status while Salad finds the
                  best miner to run on your machine.
                  <b> Remember, Salad is best left AFK!!!</b>
                </P>
                <P>There are 3 states of Salad that you should be aware of:</P>
                <P>
                  <b>STOPPED</b>
                  <br /> Salad isn't doing anything, your machine is NOT being used, and you won't earn anything.
                </P>
                <P>
                  <b>PREPPING</b>
                  <br /> Salad is now downloading and running a miner. Things are warming up but we are still waiting
                  for confirmation that your miner is running properly. This can take some time.
                </P>
                <P>
                  <b>CHOPPING</b>
                  <br /> Salad has now confirmed that your miner is running correctly and you will start to earn soon.
                </P>
                <P>
                  Don't forget to enable{' '}
                  <b>
                    <SmartLink to="/settings/windows-settings">Auto Start</SmartLink>
                  </b>
                  , this will allow Salad to automatically start when you step away from your machine.
                </P>
              </div>
              <div className={classes.column}>
                <div className={classes.startContainer}>
                  <StartButtonContainer />
                </div>
              </div>
            </div>
            <Divider />

            <div className={classes.splitContainer}>
              <div className={classes.column} style={{ paddingRight: 20 }}>
                <SectionHeader>What is XP?</SectionHeader>
                <P>
                  XP stands for "Experience Points," and simply denotes how much you've mined with Salad. You are
                  awarded 1 XP per minute of confirmed mining time. The more you run, the more XP you will accrue and
                  the more veggies you will unlock in the Pantry.
                </P>
              </div>
              <div className={classes.column} style={{ paddingLeft: 20 }}>
                <SectionHeader>More Information</SectionHeader>
                <br />
                <P>
                  <SmartLink to="https://support.salad.io/hc/en-us/sections/360008458292-Anti-Virus">
                    Having Anti-Virus Issues?
                  </SmartLink>
                </P>
                <P>
                  <SmartLink to="https://medium.com/@saladchefs/a-gamers-guide-to-blockchain-and-crypto-b76bce353a4d">
                    Gamers Guide to Blockchain
                  </SmartLink>
                </P>
                <P>
                  <SmartLink to="https://medium.com/@saladchefs/making-money-with-salad-whats-the-catch-f33ad86d1a9c">
                    What's the Catch?
                  </SmartLink>
                </P>
                <P>
                  <SmartLink to="https://medium.com/@saladchefs/does-mining-for-cryptocurrency-damage-my-gpu-5a74827a0742">
                    Does mining hurt my machine?
                  </SmartLink>
                </P>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    )
  }
}

export const MiningInformation = withStyles(styles)(_MiningInformation)
