import React, { Component } from 'react'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

import { SaladTheme } from '../../../SaladTheme'
import { P } from '../../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
    minHeight: 64,
    width: 294,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    boxShadow: `2px 5px 5px 0px black`,
    border: `1px solid ${theme.darkBlue}`,
  },
  title: {
    whiteSpace: 'nowrap',
    marginRight: 16,
    overflow: 'hidden',
  },
  contentContainer: {
    padding: '0 10px',
    width: '100%',
    overflow: 'hidden',
    flex: 1,
  },
  error: {
    backgroundColor: theme.red,
  },
  clickable: {
    cursor: 'pointer',
  },
  closeButton: {
    color: theme.lightGreen,
    position: 'absolute',
    right: '.5rem',
    top: '.25rem',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  closeToast?: () => void
  title?: string
  message?: string
  error?: boolean
}

class _NotificationToast extends Component<Props> {
  handleClose = () => {
    const { closeToast } = this.props
    if (closeToast) {
      closeToast()
    }
  }
  render() {
    const { title, message, error, classes, closeToast } = this.props
    return (
      <div
        className={classnames(classes.container, { [classes.error]: error, [classes.clickable]: closeToast })}
        onClick={this.handleClose}
      >
        {closeToast && (
          <div className={classes.closeButton}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        )}
        <div className={classes.contentContainer}>
          <P bold className={classes.title}>
            {title}
          </P>
          <P>{message}</P>
        </div>
      </div>
    )
  }
}

export const NotificationToast = withStyles(styles)(_NotificationToast)
