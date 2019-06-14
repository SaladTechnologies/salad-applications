import React, { Component } from 'react'

// Styles
import { styles } from './CondensedHeader.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  value?: string
}

class CondensedHeader extends Component<Props> {
  render() {
    const { value, classes } = this.props

    return (
      <h1 className={classnames(classes.condensedHeader)}>{value}</h1>
    )
  }
}

export default withStyles(styles)(CondensedHeader)
