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
  onClick?: () => void
  title?: string
  message?: string
  isError?: boolean
}

class _NotificationToast extends Component<Props> {
  handleClick = () => {
    const { onClick } = this.props
    onClick?.()
  }

  render() {
    const { title, message, isError, classes } = this.props
    return (
      <div className={classnames(classes.container, classes.clickable, { [classes.error]: isError })}>
        <div className={classes.closeButton}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <div className={classes.contentContainer} onClick={this.handleClick}>
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
