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
})

interface Props extends WithStyles<typeof styles> {}

class _Username extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <label className={classnames(classes.username)}>{children}</label>
  }
}

export const Username = withStyles(styles)(_Username)
