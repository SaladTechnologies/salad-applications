import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'

// Assets
import i from '../../../components/elements/InfoButton/assets/i.svg'

// Components
import { StatElement, Tooltip } from '../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
// @ts-ignore
import ReactHintFactory from 'react-hint'

const ReactHint = ReactHintFactory(React)

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'inline-flex',
    flexDirection: 'column',
    userSelect: 'none',
    alignItems: 'flex-end',
  },

  infoContainer: {
    display: 'flex',
  },

  infoButton: {
    color: theme.lightGreen,
    display: 'inline-block',
    marginTop: 7,
    cursor: 'help',
  },

  tootipListItem: {
    marginBottom: 2
  }
})

interface Props extends WithStyles<typeof styles> {
  /** The earning rate (USD/s) */
  earningRate?: number
  miningStatus?: string
}

class _UserStatsSummary extends Component<Props> {
  render() {
    const { earningRate, miningStatus, classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.infoContainer}>
          <span className={classes.infoButton} data-mining-status>
            <img height={25} width={'auto'} src={i} />
          </span>
          <ReactHint
            autoPosition
            events
            attribute="data-mining-status"
            onRenderContent={() => (
              <>
                <Tooltip>
                  <div className={classes.tootipListItem}>
                    <strong>Initializing</strong>: First step! Salad is detecting your hashrate.
                  </div>
                  <div className={classes.tootipListItem}>
                    <strong>Running</strong>: Salad detected a hashrate and is trying to submit a share.
                  </div>
                  <div>
                    <strong>Earning</strong>: Salad is successfully submitting shares. You should see your balance
                    rising.
                  </div>
                </Tooltip>
              </>
            )}
          />

          <StatElement title="Mining status" values={[miningStatus || 'Stopped']} />
        </div>
        <StatElement
          title="Earning Rate"
          values={[earningRate === undefined ? 'Loading' : `$${(earningRate * 86400).toFixed(3)}/day`]}
        />
      </div>
    )
  }
}

export const UserStatsSummary = withStyles(styles)(_UserStatsSummary)
