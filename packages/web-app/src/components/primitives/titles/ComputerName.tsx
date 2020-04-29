import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'

const styles = (theme: SaladTheme) => ({
  username: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.medium,
    lineHeight: theme.medium,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _ComputerName extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <label className={classes.username}>{children}</label>
  }
}

export const ComputerName = withStyles(styles)(_ComputerName)
