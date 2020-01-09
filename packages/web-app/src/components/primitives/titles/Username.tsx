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
    fontSize: theme.mediumLarge,
    lineHeight: theme.mediumLarge,
  },
  blue: {
    color: theme.darkBlue,
  },
})

interface Props extends WithStyles<typeof styles> {
  blue?: boolean
  className?: string
}

class _Username extends Component<Props> {
  render() {
    const { blue, className, children, classes } = this.props

    return <label className={classnames(classes.username, className, { [classes.blue]: blue })}>{children}</label>
  }
}

export const Username = withStyles(styles)(_Username)
