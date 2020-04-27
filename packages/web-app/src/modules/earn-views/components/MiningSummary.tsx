import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { StartButtonContainer } from '../../machine-views'
import { MiningStatus } from '../../machine/models'
import { StatElement } from '../../../components'
import { formatDuration } from '../../../utils'
import { Machine } from '../../machine/models/Machine'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {},
  row: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  incompatibleText: {
    color: theme.red,
    fontFamily: theme.fontGroteskBook25,
    padding: 5,
  },
})

interface Props extends WithStyles<typeof styles> {
  status?: MiningStatus
  lifetimeXp?: number
  runningTime?: number
  machine?: Machine
}

class _MiningSummary extends Component<Props> {
  render() {
    const { runningTime, status, lifetimeXp, machine, classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.row}>
          <div className={classes.row}>
            <StartButtonContainer />
            <StatElement
              title={runningTime ? formatDuration(runningTime) : 'Status'}
              values={[`${(status || MiningStatus.Stopped).toUpperCase()}`]}
            />
          </div>
          <StatElement title={'Total XP'} values={[Math.round(lifetimeXp || 0).toLocaleString() || '0']} />
        </div>
        {machine && (
          <>
            {!machine?.validGpus && (
              <div className={classes.row}>
                <div className={classes.incompatibleText}>Your GPU is incompatible with Salad</div>
              </div>
            )}
            {!machine?.validOs && (
              <div className={classes.row}>
                <div className={classes.incompatibleText}>Your version of Windows is incompatible with Salad</div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }
}

export const MiningSummary = withStyles(styles)(_MiningSummary)
