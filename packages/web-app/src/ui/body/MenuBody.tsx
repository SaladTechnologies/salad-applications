import React, { Component } from 'react'

// Styles
import { styles } from './MenuBody.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  value?: string
}

class _MenuBody extends Component<Props> {
  render() {
    const { value, classes } = this.props

    return (
      <p className={classnames(classes.menuBody)}>{value}</p>
    )
  }
}

export const MenuBody = withStyles(styles)(_MenuBody)
