import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  condensedHeader: {
    color: theme.darkBlue,
    fontFamily: theme.fontGroteskLight09,
    fontSize: theme.xLarge,
    lineHeight: theme.xLarge,
    fontWeight: 'normal',
    margin: 0,
    padding: 0,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _CondensedHeader extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <h1 className={classnames(classes.condensedHeader)}>{children}</h1>
  }
}

export const CondensedHeader = withStyles(styles)(_CondensedHeader)
