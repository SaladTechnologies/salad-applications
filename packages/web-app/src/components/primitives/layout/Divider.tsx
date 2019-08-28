import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  divider: {
    color: theme.lightGreen,
    backgroundColor: theme.lightGreen,
    height: 2,
    border: 0,
    margin: '1rem 0',
  },
})

interface Props extends WithStyles<typeof styles> {}

class _Divider extends Component<Props> {
  render() {
    const { classes } = this.props

    return <hr className={classnames(classes.divider)} />
  }
}

export const Divider = withStyles(styles)(_Divider)
