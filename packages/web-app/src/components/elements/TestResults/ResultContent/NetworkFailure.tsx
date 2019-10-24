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
        TODO: Something more comforting than this as our text. This could be an issue that is resolved later, maybe
        encourage them to run the test again.
      </>
    )
  }
}

export const NetworkFailure = withStyles(styles)(_NetworkFailure)
