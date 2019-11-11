import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  appBody: {
    fontFamily: (props: Props) => props.fontLight ? theme.fontGroteskLight25 : theme.fontGroteskBook19,
    fontSize: theme.small,
    lineHeight: theme.medium,
  },
})

interface Props extends WithStyles<typeof styles> {
  className?: string
  fontLight?: boolean
}

class _P extends Component<Props> {
  render() {
    const { className, children, classes } = this.props

    return <p className={classnames(classes.appBody, className)}>{children}</p>
  }
}

export const P = withStyles(styles)(_P)
