import React, { Component } from 'react'

// Styles
import { styles } from './Cylon.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
// import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {}

class _Cylon extends Component<Props> {
  render() {
    const { classes } = this.props

    return <div className={classes.cylon}>{/* Cylon */}</div>
  }
}

export const Cylon = withStyles(styles)(_Cylon)
