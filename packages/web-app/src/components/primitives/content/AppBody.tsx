import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  appBody: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: theme.small,
    lineHeight: theme.medium,
  },
})

interface Props extends WithStyles<typeof styles> {
}

class _AppBody extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <p className={classnames(classes.appBody)}>{children}</p>
  }
}

export const AppBody = withStyles(styles)(_AppBody)
