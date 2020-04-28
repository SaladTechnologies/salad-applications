import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { ExternalLink, P, Divider, SectionHeader } from '../../../components'
import Scrollbars from 'react-custom-scrollbars'
import { SaladTheme } from '../../../SaladTheme'
import { MiningSummary } from '../components'
import classNames from 'classnames'
import { SlicedVeggieContainer, PantryContainer } from '../../xp-views'
import { MiningStatus } from '../../machine/models'
import { Machine } from '../../machine/models/Machine'

const styles = (theme: SaladTheme) => ({
  container: {
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
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
  mainColumn: {
    flex: 1,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
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

interface Props extends WithStyles<typeof styles> {
  status?: MiningStatus
  lifetimeXp?: number
  runningTime?: number
  machine?: Machine
}

class _MiningPage extends Component<Props> {
  render() {
    const { status, lifetimeXp, runningTime, machine, classes } = this.props

    return (
      <div className={classNames(classes.container, classes.splitContainer)}>
        <Scrollbars>
          <div className={classNames(classes.content, classes.splitContainer)}>
            <div className={classNames(classes.column, classes.mainColumn)}>
              <MiningSummary status={status} lifetimeXp={lifetimeXp} runningTime={runningTime} machine={machine} />
              <Divider />

              <SectionHeader>Pantry</SectionHeader>
              <PantryContainer />
              <Divider />

              <SectionHeader>More Information</SectionHeader>
              <br />
              <P>
                <ExternalLink path="https://support.salad.io/hc/en-us/sections/360008458292-Anti-Virus">
                  Having Anti-Virus Issues?
                </ExternalLink>
              </P>
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
          </div>
        </Scrollbars>
        <div className={classes.column}>
          <SlicedVeggieContainer />
        </div>
      </div>
    )
  }
}

export const MiningPage = withStyles(styles)(_MiningPage)
