import React, { Component } from 'react'
import { SaladTheme } from '../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.green,
    width: '25rem',
    padding: '1rem .5rem',
    position: 'relative',
    userSelect: 'none',
  },
  closeButton: {
    color: theme.darkBlue,
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
  content?: ReactNode
  visible?: boolean
  onCloseClicked?: () => void
}

class _Modal extends Component<Props> {
  handleClose = () => {
    const { onCloseClicked } = this.props
    if (onCloseClicked) {
      onCloseClicked()
    }
  }
  render() {
    const { onCloseClicked, classes, children } = this.props
    return (
      <div className={classNames(classes.container)}>
        {onCloseClicked && (
          <div className={classes.closeButton} onClick={this.handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        )}
        {children}
      </div>
    )
  }
}

export const Modal = withStyles(styles)(_Modal)
