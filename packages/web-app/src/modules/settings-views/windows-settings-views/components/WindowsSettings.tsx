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
    const apiVersion: boolean = window.salad && window.salad.apiVersion > 1

    let toggler =
      apiVersion ? (
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
          {!apiVersion && <VeggieName>Coming Soon</VeggieName>}
          <CondensedHeader>Windows Settings</CondensedHeader>
          <hr className={classnames(classes.hr)} />
        </div>
        <div className={classnames(classes.main)}>
          <div className={classnames(classes.toggler)}>{toggler}</div>
          <div className={classnames(classes.description)}>
            <Username blue>Auto Launch {!apiVersion && '(Coming in v0.2.1)'}</Username>
            <AppBody>
              Auto Launch opens Salad once you log into Windows, getting the Kitchen warmed up for when you're ready
              to start chopping.
            </AppBody>
          </div>
        </div>
      </>
    )
  }
}

export const WindowsSettings = withStyles(styles)(_WindowsSettings)
