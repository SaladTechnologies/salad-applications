import React, { Component } from 'react'

// Styles
import { styles } from './AntivirusFailure.styles'

// Components
import { H4 } from '../../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {
  
}

class _AntivirusFailure extends Component<Props> {
  render() {
    const {  } = this.props

    return (
      <>
        <H4>Looks like your Anti-Virus removed the miner. Follow the guide to whitelist Salad:</H4>
        TODO: Auto detect AV, if not found show dropdown list
        
        <select>
          <option>Select your Anti-Virus</option>
        </select>

        <H4>You need to whitelist this path:</H4>
        <div>C:\Users\{`{Username}`}\AppData\Local\Programs\Salad</div>
        <div>%AppData%\Salad</div>
      </>
    )
  }
}

export const AntivirusFailure = withStyles(styles)(_AntivirusFailure)
