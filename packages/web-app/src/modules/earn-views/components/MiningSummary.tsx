import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { StatElement } from '../../../components'
import { StartButtonContainer } from '../../machine-views'

const styles = {
  container: {},
  row: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
}

interface Props extends WithStyles<typeof styles> {
  lifetimeXp?: number
}

class _MiningSummary extends Component<Props> {
  render() {
    const { lifetimeXp, classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.row}>
          <div className={classes.row}>
            <StartButtonContainer />
          </div>
          <StatElement
            title={'Total XP'}
            values={[Math.round(lifetimeXp || 0).toLocaleString() || '0']}
            infoText={'Total Experience Points earned \nYou are awarded 1 XP/minute while mining'}
          />
        </div>
      </div>
    )
  }
}

export const MiningSummary = withStyles(styles)(_MiningSummary)
