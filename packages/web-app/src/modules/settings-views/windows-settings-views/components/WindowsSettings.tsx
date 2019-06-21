import React, { Component } from 'react'

// Styles
import { styles } from './WindowsSettings.styles'

// Store
import { getStore } from '../../../../Store'

// UI
import {
  VeggieName,
  CondensedHeader,
  Body,
} from '../../../../ui'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import { ToggleSwitch } from '../../../../components';

interface Props extends WithStyles<typeof styles> {

}

class _WindowsSettings extends Component<Props> {
  store = getStore()

  enableAutoLaunch = () => {
    this.store.native.enableAutoLaunch()
  }

  disableAutoLaunch = () => {
    this.store.native.disableAutoLaunch()
  }

  render() {
    return (
      <>
        <header>
          <VeggieName value="Coming Soon" />
          <CondensedHeader value="Windows Settings" />
        </header>
        <main>
          <Body>
            What's a knock-out like you doing in a computer-generated gin joint like this? 
            I can't. As much as I care about you, my first duty is to the ship.
          </Body>

          <ToggleSwitch />
          <br />
          <br />
          <br />

          <button onClick={this.enableAutoLaunch}>Enable Autos Launch</button>
          <button onClick={this.disableAutoLaunch}>Disable Auto Launch</button>
        </main>
      </>
    )
  }
}

export const WindowsSettings = withStyles(styles)(_WindowsSettings)
