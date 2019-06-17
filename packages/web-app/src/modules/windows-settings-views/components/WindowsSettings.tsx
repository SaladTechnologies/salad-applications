import React, { Component } from 'react'

// Styles
import { styles } from './WindowsSettings.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {

}

class _WindowsSettings extends Component<Props> {
  render() {
    console.log('[WindowsSettings] Am I here???')

    return (
      <>
        <b>Windows Settings</b>
        <p>
          Coming soon!
        </p>
      </>
    )
  }
}

export const WindowsSettings = withStyles(styles)(_WindowsSettings)
