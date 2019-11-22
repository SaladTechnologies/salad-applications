import React, { Component } from 'react'

// Styles
import { styles } from './SmartStart.styles'

// UI
import {
  CondensedHeader,
  P,
} from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {}

class _SmartStart extends Component<Props> {
  render() {
    return (
      <>
        <div className="header">
          <CondensedHeader>Smart Start</CondensedHeader>
        </div>
        <div className="main">
          <P>
            Smartypants Salad will start chopping whenever you're not using the computer, and automatically stop when
            you are.Open on boot up, and Salad will launch after booting up your computer.
          </P>
        </div>
      </>
    )
  }
}

export const SmartStart = withStyles(styles)(_SmartStart)
