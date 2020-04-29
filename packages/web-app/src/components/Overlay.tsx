import React, { Component } from 'react'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  overlayContainer: {
    backgroundColor: theme.darkBlue,
    display: 'flex',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999,
  },
})

interface Props extends WithStyles<typeof styles> {
  onCloseClicked?: () => void
  onCloseKeyPress?: (e: any) => void
}

class _Overlay extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <div className={classnames(classes.overlayContainer)}>{children}</div>
  }
}

export const Overlay = withStyles(styles)(_Overlay)
