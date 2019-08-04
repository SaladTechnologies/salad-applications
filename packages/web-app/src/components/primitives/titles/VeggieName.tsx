import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  veggieName: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.xSmall,
    lineHeight: theme.xSmall,
    letterSpacing: 1,
    textTransform: 'uppercase',
    margin: 0,
    padding: 0,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _VeggieName extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <label className={classnames('veggieName', classes.veggieName)}>{children}</label>
  }
}

export const VeggieName = withStyles(styles)(_VeggieName)
