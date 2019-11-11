import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  h3: {
    color: theme.green,
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.large,
    lineHeight: theme.singleLarge,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _H3 extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <label className={classnames(classes.h3)}>{children}</label>
  }
}

export const H3 = withStyles(styles)(_H3)
