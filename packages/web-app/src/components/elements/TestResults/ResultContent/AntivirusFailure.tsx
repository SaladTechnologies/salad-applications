import React, { Component } from 'react'

// Styles
import { styles } from './AntivirusFailure.styles'

// Components
import { MenuTitle, H4 } from '../../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'

interface Props extends WithStyles<typeof styles> {
  installPath?: string
}

class _AntivirusFailure extends Component<Props> {
  render() {
    const { installPath, classes } = this.props

    return (
      <div className={classes.avError}>
        <H4>Looks like your Anti-Virus removed the miner. Follow the guide to whitelist Salad:</H4>
        <div className={classes.avSelectContainer}>
          <select>
            <option>Select your Anti-Virus</option>
          </select>
        </div>

        <H4>You need to whitelist this path:</H4>
        <div className={classes.pathContainer}>
          <MenuTitle className={classes.installPath}>{installPath}</MenuTitle>
          <CopyToClipboard text={installPath || ''}>
            <FontAwesomeIcon className={classes.iconButton} icon={faClipboard} size={'lg'} />
          </CopyToClipboard>
        </div>
      </div>
    )
  }
}

export const AntivirusFailure = withStyles(styles)(_AntivirusFailure)
