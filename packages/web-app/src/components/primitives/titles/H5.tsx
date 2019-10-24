import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  h5: {
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.small,
    lineHeight: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _H5 extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <label className={classnames(classes.h5)}>{children}</label>
  }
}

export const H5 = withStyles(styles)(_H5)
