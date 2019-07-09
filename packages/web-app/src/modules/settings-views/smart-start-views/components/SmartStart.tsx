import React, { Component } from 'react'

// Styles
import { styles } from './SmartStart.styles'

// UI
import {
  VeggieName,
  CondensedHeader,
  AppBody,
} from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {}

class _SmartStart extends Component<Props> {
  render() {
    return (
      <>
        <div className="header">
          <VeggieName>Coming Soon</VeggieName>
          <CondensedHeader>Smart Start</CondensedHeader>
        </div>
        <div className="main">
          <AppBody>
            Smartypants Salad will start chopping whenever you’re not using the computer, and automatically stop when
            you are.Open on boot up, and Salad will launch after booting up your computer.
          </AppBody>
        </div>
      </>
    )
  }
}

export const SmartStart = withStyles(styles)(_SmartStart)
