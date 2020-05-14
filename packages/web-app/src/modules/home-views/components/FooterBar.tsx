import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { SmartLink } from '../../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
import { MiningStatus } from '../../machine/models'

export class MenuItem {
  constructor(public readonly name: string, public readonly url: string, public readonly showNotification?: boolean) {}
}

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
    textTransform: 'uppercase',
  },
  button: {
    padding: '0px 10px',
    cursor: 'pointer',
    '&:hover': {
      color: theme.lightGreen,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  status?: string
  onToggleMining?: () => void
}

class _FooterBar extends Component<Props> {
  handleClick = () => {
    const { onToggleMining } = this.props

    onToggleMining?.()
  }

  render() {
    const { status, classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.button} onClick={this.handleClick}>
          {status === MiningStatus.Stopped ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faStop} />}
        </div>
        <div className={classes.statusText}>
          Status: <SmartLink to="/earn/mine">{status}</SmartLink>
        </div>
      </div>
    )
  }
}

export const FooterBar = withStyles(styles)(_FooterBar)
