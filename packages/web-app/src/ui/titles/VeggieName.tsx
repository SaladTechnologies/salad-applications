import React, { Component } from 'react'

// Styles
import { styles } from './VeggieName.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  value?: string
}

class _VeggieName extends Component<Props> {
  render() {
    const { value, classes } = this.props

    return (
      <h6 className={classnames('veggieName', classes.veggieName)}>{value}</h6>
    )
  }
}

export const VeggieName = withStyles(styles)(_VeggieName)
