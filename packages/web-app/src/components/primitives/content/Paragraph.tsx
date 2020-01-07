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
  bold: {
    fontWeight: 'bold',
  },
})

interface Props extends WithStyles<typeof styles> {
  className?: string
  bold?: boolean
}

class _P extends Component<Props> {
  render() {
    const { className, bold, children, classes } = this.props

    return <p className={classnames(classes.appBody, className, { [classes.bold]: bold })}>{children}</p>
  }
}

export const P = withStyles(styles)(_P)
