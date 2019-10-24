import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  h2: {
    color: theme.mediumGreen,
    fontFamily: theme.fontGroteskLight09,
    fontSize: theme.xLarge,
    lineHeight: theme.xLarge,
  },
})

interface Props extends WithStyles<typeof styles> {
}

class _H2 extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <label className={classnames(classes.h2)}>{children}</label>
  }
}

export const H2 = withStyles(styles)(_H2)
