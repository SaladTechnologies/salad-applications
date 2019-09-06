import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  username: {
    color: theme.green,
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.medium,
    lineHeight: theme.medium,
  },
  blue: {
    color: theme.darkBlue,
  },
})

interface Props extends WithStyles<typeof styles> {
  blue?: boolean
}

class _ComputerName extends Component<Props> {
  render() {
    const { blue, children, classes } = this.props

    return <label className={classnames(classes.username, {[classes.blue]: blue})}>{children}</label>
  }
}

export const ComputerName = withStyles(styles)(_ComputerName)
