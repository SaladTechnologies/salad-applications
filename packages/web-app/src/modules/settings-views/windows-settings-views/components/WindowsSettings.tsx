import React, { Component } from 'react'

// Styles
import { styles } from './WindowsSettings.styles'

// UI
import {
  VeggieName,
  CondensedHeader,
  AppBody,
} from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {

}

class _WindowsSettings extends Component<Props> {
  render() {
    return (
      <>
        <div className="header">
          <VeggieName>Coming Soon</VeggieName>
          <CondensedHeader>Windows Settings</CondensedHeader>
        </div>
        <div className="main">
          <AppBody>
            
          </AppBody>
        </div>
      </>
    )
  }
}

export const WindowsSettings = withStyles(styles)(_WindowsSettings)
