import React, { Component } from 'react'

// Styles
import { styles } from './SmartStart.styles'

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

class _SmartStart extends Component<Props> {
  render() {
    return (
      <>
        <header>
          <VeggieName value="Coming Soon" />
          <CondensedHeader value="Smart Start" />
        </header>
        <main>
          <Body>
            Smartypants Salad will start chopping whenever you’re not using the computer, and automatically stop when
            you are.Open on boot up, and Salad will launch after booting up your computer.
          </Body>
        </main>
      </>
    )
  }
}

export const SmartStart = withStyles(styles)(_SmartStart)
