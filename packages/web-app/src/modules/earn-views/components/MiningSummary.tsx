import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { StartButtonContainer } from '../../machine-views'
import { StatElement } from '../../../components'
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
  lifetimeXp?: number
  machine?: Machine
}

class _MiningSummary extends Component<Props> {
  render() {
    const { lifetimeXp, machine, classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.row}>
          <div className={classes.row}>
            <StartButtonContainer />
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
