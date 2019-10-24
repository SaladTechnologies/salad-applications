import React, { Component } from 'react'

// Styles
import { styles } from './UnknownFailure.styles'

// Components
import { H4 } from '../../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {}

class _UnknownFailure extends Component<Props> {
  render() {
    return (
      <>
        <H4>Unknown error.</H4>
        TODO: Something more comforting than this as our text. This could be an issue that is resolved later, maybe
        encourage them to run the test again.
      </>
    )
  }
}

export const UnknownFailure = withStyles(styles)(_UnknownFailure)
