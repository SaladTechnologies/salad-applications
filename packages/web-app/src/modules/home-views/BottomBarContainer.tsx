import React, { Component } from 'react'
import { BottomBar } from './components/BottomBar'

export class BottomBarContainer extends Component {
  handleDiscord = () => {
    this.openLink('https://discord.gg/xcvmgQk')
  }

  handleSupport = () => {
    this.openLink('https://salad.zendesk.com')
  }

  openLink = (url: string) => {
    window.open(url, '_blank')
  }
  render() {
    return <BottomBar onDiscordClick={this.handleDiscord} onSupportClick={this.handleSupport} />
  }
}
