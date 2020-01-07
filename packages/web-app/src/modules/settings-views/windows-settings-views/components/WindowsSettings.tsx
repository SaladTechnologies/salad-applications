import React, { Component } from 'react'

// Styles
import { styles } from './WindowsSettings.styles'

// UI
import { CondensedHeader, Divider, Slider, P } from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import { ToggleSetting } from '../../components'

interface Props extends WithStyles<typeof styles> {
  autoLaunch?: boolean
  autoLaunchToggle?: () => void
  autoStart?: boolean
  autoStartToggle?: () => void
  autoStartEnabled?: boolean
  autoStartDelay?: number
  autoStartUpdate?: (value: number) => void
}

class _WindowsSettings extends Component<Props> {
  render() {
    const {
      autoLaunch,
      autoLaunchToggle,
      autoStart,
      autoStartToggle,
      autoStartEnabled,
      autoStartDelay,
      autoStartUpdate,
    } = this.props

    return (
      <>
        <div className="header">
          <CondensedHeader>Settings</CondensedHeader>
        </div>
        <Divider />
        <ToggleSetting
          title={'Auto Launch'}
          description={
            "Auto Launch opens Salad once you log into Windows, getting the Kitchen warmed up for when you're ready to start chopping."
          }
          toggled={autoLaunch}
          onToggle={autoLaunchToggle}
        />
        {autoStartEnabled && (
          <>
            <Divider />
            <ToggleSetting
              title={'Auto Start'}
              description={
                'Salad will automatically start to run after being AFK a determined amount of time *and* will automatically stop when your return.'
              }
              toggled={autoStart}
              onToggle={autoStartToggle}
            >
              <div style={{ width: 300 }}>
                <P>START AFTER {autoStartDelay ? autoStartDelay / 60 : 10} MINUTES</P>
                <Slider
                  stepSize={10}
                  minimum={10}
                  maximum={60}
                  value={autoStartDelay ? autoStartDelay / 60 : 10}
                  onValueChange={(value: number) => {
                    if (autoStartUpdate) autoStartUpdate(value * 60)
                  }}
                />
              </div>
            </ToggleSetting>
          </>
        )}
      </>
    )
  }
}

export const WindowsSettings = withStyles(styles)(_WindowsSettings)
