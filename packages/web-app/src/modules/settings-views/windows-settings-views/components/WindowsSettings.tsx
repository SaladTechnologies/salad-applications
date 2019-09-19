import React, { Component } from 'react'

// Styles
import { styles } from './WindowsSettings.styles'

// Store
import { getStore } from '../../../../Store'

// UI
import { Username, CondensedHeader, P, ToggleSwitch, Divider } from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {}

class _WindowsSettings extends Component<Props> {
  store = getStore()

  toggleAutoLaunch = () => {
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
          <CondensedHeader>Settings</CondensedHeader>
        </div>
        <Divider />
        <div className={classnames(classes.container)}>
          <div className={classnames(classes.toggler)}>{toggler}</div>
          <div className={classnames(classes.description)}>
            <Username blue>Auto Launch {!apiVersion && '(Coming in v0.2.1)'}</Username>
            <P>
              Auto Launch opens Salad once you log into Windows, getting the Kitchen warmed up for when you're ready to
              start chopping.
            </P>
          </div>
        </div>
      </>
    )
  }
}

export const WindowsSettings = withStyles(styles)(_WindowsSettings)
