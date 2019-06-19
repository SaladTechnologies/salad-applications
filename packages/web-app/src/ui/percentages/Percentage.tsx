import React, { Component } from 'react'

// Styles
import { styles } from './Percentage.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  value?: string
}

class _Percentage extends Component<Props> {
  render() {
    const { value, classes } = this.props

    return (
      <span className={classnames(classes.percentage)}>{value}</span>
    )
  }
}

export const Percentage = withStyles(styles)(_Percentage)
