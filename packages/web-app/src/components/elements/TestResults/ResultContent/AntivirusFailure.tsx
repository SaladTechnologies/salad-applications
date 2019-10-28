import React, { Component } from 'react'

// Styles
import { styles } from './AntivirusFailure.styles'

// Components
import { MenuTitle, H4, Select, ExternalLink } from '../../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'

interface Props extends WithStyles<typeof styles> {
  installPath?: string
}

class _AntivirusFailure extends Component<Props> {
  state = {
    link: 'https://www.salad.io/',
  }

  handleAVSelect = (e: any) => {
    this.setState({
      link: e.target.value,
    })
  }

  render() {
    const { installPath, classes } = this.props

    const avList: { text: string; value: string }[] = [
      {
        text: 'Select your Anti-Virus',
        value: '',
      },
      {
        text: 'Norton',
        value: 'https://salad.zendesk.com/hc/en-us/articles/360032211151-How-to-Whitelist-Salad-in-Norton-Antivirus',
      },
      {
        text: 'Malwarebytes',
        value: 'https://salad.zendesk.com/hc/en-us/articles/360031870772-How-to-Whitelist-Salad-in-Malwarebytes',
      },
      {
        text: 'Panda',
        value: 'https://salad.zendesk.com/hc/en-us/articles/360033488451-How-to-Whitelist-Salad-in-Panda',
      },
      {
        text: 'Kaspersky',
        value: 'https://salad.zendesk.com/hc/en-us/articles/360033487651-How-to-Whitelist-Salad-in-Kaspersky',
      },
      {
        text: 'McAfee',
        value: 'https://salad.zendesk.com/hc/en-us/articles/360033488271-How-to-whitelist-Salad-in-McAfee',
      },
      {
        text: 'Bitdefender',
        value:
          'https://salad.zendesk.com/hc/en-us/articles/360033488151-How-to-Whitelist-Salad-in-Bitdefender-Antivirus-PLUS',
      },
      {
        text: 'Windows Defender',
        value: 'https://salad.zendesk.com/hc/en-us/articles/360033124692-How-to-Whitelist-Salad-in-Windows-Defender',
      },
      {
        text: 'Avast',
        value: 'https://salad.zendesk.com/hc/en-us/articles/360033487211-How-to-Whitelist-Salad-in-Avast-Antivirus',
      },
    ]

    return (
      <div className={classes.avError}>
        <H4>Looks like your Anti-Virus removed the miner. Follow the guide to whitelist Salad:</H4>
        <div className={classes.avSelectContainer}>
          <Select list={avList} selectedValue={this.handleAVSelect} className={classes.avSelect} />
          <ExternalLink path={this.state.link} className={classes.supportButton}>Open support</ExternalLink>
        </div>

        <H4>You need to whitelist this path:</H4>
        <div className={classes.pathContainer}>
          <MenuTitle className={classes.installPath}>{installPath}</MenuTitle>
          <CopyToClipboard text={installPath || ''}>
            <FontAwesomeIcon className={classes.iconButton} icon={faClipboard} size={'sm'} />
          </CopyToClipboard>
        </div>

        
      </div>
    )
  }
}

export const AntivirusFailure = withStyles(styles)(_AntivirusFailure)
