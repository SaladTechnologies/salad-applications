import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  h4: {
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.mediumLarge,
    lineHeight: theme.singleLarge,
  },
})

interface Props extends WithStyles<typeof styles> {
  className?: string
}

class _H4 extends Component<Props> {
  render() {
    const { className, children, classes } = this.props

    return <label className={classnames(className, classes.h4)}>{children}</label>
  }
}

export const H4 = withStyles(styles)(_H4)
