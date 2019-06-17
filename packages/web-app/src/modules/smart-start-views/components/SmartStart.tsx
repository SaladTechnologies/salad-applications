import React, { Component } from 'react'

// Styles
import { styles } from './SmartStart.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
// import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {

}

class _SmartStart extends Component<Props> {
  render() {
    console.log('[SmartStart] Am I here???')

    return (
      <p>
        <b>Smart Start: </b>
        Smartypants Salad will start chopping whenever you’re not using the computer, and automatically stop when
        you are.Open on boot up, and Salad will launch after booting up your computer.
      </p>
    )
  }
}

export const SmartStart = withStyles(styles)(_SmartStart)
