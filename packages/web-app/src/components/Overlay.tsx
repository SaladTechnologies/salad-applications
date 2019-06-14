import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../SaladTheme'

// UI
import 

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.darkBlue,
    borderTop: `solid 1px ${theme.darkGreen}`,
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
      <div className={classnames(classes.container)}>
        <div>
          <nav>
            App Settings
            <ul>
              <li>Smart Start</li>
              <li>Battery Saver</li>
              <li>Desktop Notification</li>
              <li>Windows Settings</li>
            </ul>
          </nav>
        </div>
        <div>
          {children}
        </div>


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
