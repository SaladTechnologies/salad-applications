import React, { Component } from 'react'

// Styles
import { styles } from './WindowsSettings.styles'

// UI
import { Username, CondensedHeader, P, ToggleSwitch, Divider } from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  autoLaunch?: boolean
  autoLaunchToggle?: () => void
  autoStart?: boolean
  autoStartToggle?: () => void
}

class _WindowsSettings extends Component<Props> {
  render() {
    const { autoLaunch, autoLaunchToggle, classes } = this.props

    return (
      <>
        <div className="header">
          <CondensedHeader>Settings</CondensedHeader>
        </div>
        <Divider />
        <div className={classnames(classes.container)}>
          <div className={classnames(classes.toggler)}>
            <ToggleSwitch toggleLeft="Off" toggleRight="On" toggleOn={autoLaunch} toggleClick={autoLaunchToggle} />
          </div>
          <div className={classnames(classes.description)}>
            <Username blue>Auto Launch</Username>
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
