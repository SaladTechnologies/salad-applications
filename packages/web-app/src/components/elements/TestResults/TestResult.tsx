import React, { Component } from 'react'

// Styles
import { styles } from './TestResult.styles'

// Components
import { Result } from '../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {
  
}

class _TestResult extends Component<Props> {
  render() {
    return (
      <>
        <Result plugin={'Eth'} />
      </>
    )
  }
}

export const TestResult = withStyles(styles)(_TestResult)
