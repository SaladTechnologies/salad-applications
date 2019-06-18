import React, { Component } from 'react'

// Styles
import { styles } from './WindowsSettings.styles'

// UI
import {
  VeggieName,
  CondensedHeader,
  Body,
} from '../../../../ui'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {

}

class _WindowsSettings extends Component<Props> {
  render() {
    return (
      <>
        <header>
          <VeggieName value="Coming Soon" />
          <CondensedHeader value="Windows Settings" />
        </header>
        <main>
          <Body>
            
          </Body>
        </main>
      </>
    )
  }
}

export const WindowsSettings = withStyles(styles)(_WindowsSettings)
