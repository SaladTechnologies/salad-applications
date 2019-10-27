import React, { Component } from 'react'

// Styles
import { styles } from './TestResult.styles'

// Components
import { Result } from '../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {
  pluginName: string
  pluginStatus: string
  errorCategory?: string
  errorMessage?: string,
  installPath?: string
}

class _TestResult extends Component<Props> {
  render() {
    const { pluginName, pluginStatus, errorCategory, errorMessage, installPath } = this.props

    return (
      <>
        <Result
          pluginName={pluginName}
          pluginStatus={pluginStatus}
          errorCategory={errorCategory}
          errorMessage={errorMessage}
          installPath={installPath}
        />
      </>
    )
  }
}

export const TestResult = withStyles(styles)(_TestResult)
