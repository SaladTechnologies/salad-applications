import React, { Component } from 'react'

// Styles
import { styles } from './MenuTitle.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  value?: string
}

class MenuTitle extends Component<Props> {
  render() {
    const { value, classes } = this.props

    return (
      <span className={classnames(classes.menuTitle)}>{value}</span>
    )
  }
}

export default withStyles(styles)(MenuTitle)
