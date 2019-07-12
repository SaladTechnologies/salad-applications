import React, { Component } from 'react'

// Styles
import { styles } from './WindowsSettings.styles'

// Store
import { getStore } from '../../../../Store'

// UI
import { Username, VeggieName, CondensedHeader, AppBody, ToggleSwitch } from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {}

class _WindowsSettings extends Component<Props> {
  store = getStore()

  toggleAutoLaunch = () => {
    console.log('[[WindowsSettings] toggleAutoLaunch] this.store.native.autoLaunch: ', this.store.native.autoLaunch)
    if (this.store.native.autoLaunch) {
      this.store.native.disableAutoLaunch()
      return
    }

    this.store.native.enableAutoLaunch()
  }

  render() {
    const { classes } = this.props

    let toggler =
      window.salad.apiVersion > 1 ? (
        <ToggleSwitch
          toggleLeft="Off"
          toggleRight="On"
          toggleOn={this.store.native.autoLaunch}
          toggleClick={this.toggleAutoLaunch}
        />
      ) : (
        <ToggleSwitch
          toggleLeft="Off"
          toggleRight="On"
          disabled
          toggleOn={this.store.native.autoLaunch}
          toggleClick={this.toggleAutoLaunch}
        />
      )

    return (
      <>
        <div className="header">
          <VeggieName>Coming Soon</VeggieName>
          <CondensedHeader>Windows Settings</CondensedHeader>
          <hr className={classnames(classes.hr)} />
        </div>
        <div className={classnames(classes.main)}>
          <div className={classnames(classes.toggler)}>
            {toggler}
          </div>
          <div className={classnames(classes.description)}>
            <Username blue>Auto Launch</Username>
            <AppBody>
              What's a knock-out like you doing in a computer-generated gin joint like this? I can't. As much as I
              care about you, my first duty is to the ship.
            </AppBody>
          </div>
        </div>
      </>
    )
  }
}

export const WindowsSettings = withStyles(styles)(_WindowsSettings)
