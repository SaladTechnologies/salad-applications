import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  percentage: {
    color: theme.orange,
    fontFamily: theme.fontGroteskLight05,
    fontSize: theme.xxLarge,
    lineHeight: theme.xxLarge,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _Percentage extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <span className={classnames(classes.percentage)}>{children}</span>
  }
}

export const Percentage = withStyles(styles)(_Percentage)
