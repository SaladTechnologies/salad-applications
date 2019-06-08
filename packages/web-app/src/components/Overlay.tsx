import React, { Component } from 'react'
import { SaladTheme } from '../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.darkBlue,
    //width: '25rem',
    padding: '1rem 1.5rem',
    position: 'absolute',
    top: '33px',
    right: '0',
    bottom: '0',
    left: '0',
    userSelect: 'none',
  },
  closeButton: {
    fontSize: theme.mediumLarge,
    color: theme.lightGreen,
    position: 'absolute',
    right: '.5rem',
    top: '1rem',
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

class _Overlay extends Component<Props> {
  handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
            <FontAwesomeIcon icon={faTimesCircle} />
          </div>
        )}
        {children}
      </div>
    )
  }
}

export const Overlay = withStyles(styles)(_Overlay)
