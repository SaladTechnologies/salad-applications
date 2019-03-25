import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faClone, faTimes } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.lightGreen,
    height: '2rem',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch',
    paddingLeft: '1rem',
    margin: 0,
    '-webkit-app-region': 'drag',
  },
  title: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
    marginRight: 'auto',
  },
  buttons: {
    padding: '0 .75rem',
    '-webkit-app-region': 'none',
    height: '2rem',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
  closeButton: {
    '&:hover': {
      opacity: 1,
      backgroundColor: 'darkred',
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
}

class _Titlebar extends Component<Props> {
  handleClose = () => {
    const { onClose } = this.props

    if (onClose) onClose()
  }

  handleMinimize = () => {
    const { onMinimize } = this.props

    if (onMinimize) onMinimize()
  }

  handleMaximize = () => {
    const { onMaximize } = this.props

    if (onMaximize) onMaximize()
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.title}>Salad</div>
        <div onClick={this.handleMinimize}>
          <FontAwesomeIcon size="xs" className={classes.buttons} icon={faMinus} />
        </div>
        <div onClick={this.handleMaximize}>
          <FontAwesomeIcon size="xs" className={classes.buttons} icon={faClone} />
        </div>
        <div onClick={this.handleClose}>
          <FontAwesomeIcon size="xs" className={classnames(classes.closeButton, classes.buttons)} icon={faTimes} />
        </div>
      </div>
    )
  }
}

export const Titlebar = withStyles(styles)(_Titlebar)
