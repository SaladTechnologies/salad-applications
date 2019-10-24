import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  h1: {
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.singleLarge,
    lineHeight: theme.xLarge,
  },
})

interface Props extends WithStyles<typeof styles> {
}

class _H1 extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <label className={classnames(classes.h1)}>{children}</label>
  }
}

export const H1 = withStyles(styles)(_H1)
