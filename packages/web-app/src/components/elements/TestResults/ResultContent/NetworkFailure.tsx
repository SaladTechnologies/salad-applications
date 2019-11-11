import React, { Component } from 'react'

// Styles
import { styles } from './NetworkFailure.styles'

// Components
import { H4 } from '../../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {}

class _NetworkFailure extends Component<Props> {
  render() {
    return (
      <>
        <H4>Network error.</H4>
      </>
    )
  }
}

export const NetworkFailure = withStyles(styles)(_NetworkFailure)
