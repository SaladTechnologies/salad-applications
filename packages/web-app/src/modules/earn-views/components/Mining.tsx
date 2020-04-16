import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Username, ExternalLink, P, Divider, InternalLink } from '../../../components'
import Scrollbars from 'react-custom-scrollbars'
import { StartButtonContainer } from '../../machine-views'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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
    backgroundColor: theme.darkBlue,
    padding: 30,
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {}

class _Mining extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <Scrollbars>
          <div className={classes.content}>
            <Username blue>Getting Started</Username>
            <div className={classes.splitContainer}>
              <div className={classes.column}>
                <P>
                  Mining is easy, simply press the "Start" button and Salad will automatically start mining for you. In
                  many cases it will take your machine some time to get to the "Running" or "Earning" status.
                  <b> Remember, Salad is best left AFK!!!</b>
                </P>
                <P>There are 4 states of Salad that you should be aware of:</P>
                <P>
                  <b>STOPPED</b>
                  <br /> Salad isn't doing anything, your GPU is not being used, and you won't earn anything.
                </P>
                <P>
                  <b>INITIALIZING</b>
                  <br /> Salad is now downloading and running a miner. Things are warming up but we are still waiting
                  for confirmation that your miner is running properly. This can take some time.
                </P>
                <P>
                  <b>RUNNING</b>
                  <br /> Salad has now confirmed that your miner is running correctly and you will start to earn soon.
                </P>
                <P>
                  <b>EARNING</b>
                  <br /> Salad is now paying you out for the work that your GPU is performing!!
                </P>
                <P>
                  Don't forget to enable{' '}
                  <b>
                    <InternalLink to="/settings/windows-settings">Autostart</InternalLink>
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
                <Username blue>What is Mining?</Username>
                <P>
                  Mining powers the world of cryptocurrency, individual miners (computers) form vast networks of shared
                  processing power to keep networks like Ethereum and Bitcoin running. In exchange for this work, miners
                  get paid in the cryptocurrency their machine supports. Salad makes this process simple - just click
                  start and you'll begin earning Salad balance, we'll take care of the rest.
                </P>
              </div>
              <div className={classes.column} style={{ paddingLeft: 20 }}>
                <Username blue>What if I can't mine?</Username>
                <P>
                  If your machine doesn't currently support mining, don't worry! There are other options for you to earn
                  Salad balance.
                </P>
                <P>
                  <InternalLink to="/account/referrals">Referrals</InternalLink>
                </P>
                <P>
                  <InternalLink to="/earn/offerwall">Offerwalls</InternalLink>
                </P>
              </div>
            </div>

            <Divider />

            <Username blue>More Information</Username>
            <br />
            <P>
              <ExternalLink path="https://medium.com/@saladchefs/a-gamers-guide-to-blockchain-and-crypto-b76bce353a4d">
                Gamers Guide to Blockchain
              </ExternalLink>
            </P>
            <P>
              <ExternalLink path="https://medium.com/@saladchefs/making-money-with-salad-whats-the-catch-f33ad86d1a9c">
                What's the Catch?
              </ExternalLink>
            </P>
            <P>
              <ExternalLink path="https://medium.com/@saladchefs/does-mining-for-cryptocurrency-damage-my-gpu-5a74827a0742">
                Does mining hurt my machine?
              </ExternalLink>
            </P>
          </div>
        </Scrollbars>
      </div>
    )
  }
}

export const Mining = withStyles(styles)(_Mining)
