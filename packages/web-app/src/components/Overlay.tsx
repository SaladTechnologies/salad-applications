import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  overlayContainer: {
    backgroundColor: 'rgba(10, 33, 51, 0.9)',
    display: 'flex',
    position: 'fixed',
    top: '33px',
    right: 0,
    bottom: 0,
    left: 0,
    userSelect: 'none',
    zIndex: 5000
  }
})

interface Props extends WithStyles<typeof styles> {
  onCloseClicked?: () => void
}

class _Overlay extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return (
      <div className={classnames(classes.overlayContainer)}>
        {children}
      </div>
    )
  }
}

export const Overlay = withStyles(styles)(_Overlay)
