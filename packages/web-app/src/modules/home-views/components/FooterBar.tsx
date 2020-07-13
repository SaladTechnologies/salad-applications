import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { formatDuration } from '../../../utils'
import { MiningStatus } from '../../machine/models'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.green,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch',
    paddingLeft: 10,
    margin: 0,
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    borderTop: `1px solid ${theme.green}`,
  },
  statusText: {
    paddingRight: 5,
    textTransform: 'uppercase',
  },
  rightAlign: {
    marginLeft: 'auto',
  },
  button: {
    padding: '0px 10px',
  },
  enabledButton: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.lightGreen,
    },
  },
  disabledButton: {
    cursor: 'not-allowed',
    color: theme.darkGreen,
  },
})

interface Props extends WithStyles<typeof styles> {
  isEnabled?: boolean
  status?: string
  runningTime?: number
  onToggleMining?: () => void
}

class _FooterBar extends Component<Props> {
  handleClick = () => {
    const { onToggleMining, isEnabled } = this.props

    if (!isEnabled) return
    onToggleMining?.()
  }

  render() {
    const { status, runningTime, isEnabled, classes } = this.props
    return (
      <div className={classes.container}>
        <div
          className={classnames(classes.button, {
            [classes.enabledButton]: isEnabled,
            [classes.disabledButton]: !isEnabled,
          })}
          onClick={this.handleClick}
        >
          {status === MiningStatus.Stopped ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faStop} />}
        </div>
        <div className={classes.statusText}>
          Status: <SmartLink to="/earn/mine">{status}</SmartLink>
        </div>
        {runningTime !== undefined && (
          <div className={classnames(classes.statusText, classes.rightAlign)}>{formatDuration(runningTime)}</div>
        )}
      </div>
    )
  }
}

export const FooterBar = withStyles(styles)(_FooterBar)
