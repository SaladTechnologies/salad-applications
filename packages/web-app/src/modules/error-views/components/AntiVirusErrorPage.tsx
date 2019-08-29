import React, { Component } from 'react'

// Components
import { ErrorPage } from '../../../components/ErrorPage'
import { ExternalLink } from '../../../components'

interface Props {
  onCloseClicked?: () => void
  showSendLog?: boolean
  onSendLog?: () => void
}

export class AntiVirusErrorPage extends Component<Props> {
  handleSendLogClicked = () => {
    const { onSendLog } = this.props

    if (onSendLog) onSendLog()
  }

  render() {
    const { showSendLog, onCloseClicked } = this.props

    return (
      <ErrorPage
        title="Anti-Virus is Blocking Salad"
        onCloseClicked={onCloseClicked}
        showSendLog={showSendLog}
        onSendLog={this.handleSendLogClicked}
      >
        <div>
          Uh oh looks like your anti-virus is blocking our miner from running. If you have Norton or Malwarebytes follow
          the links below to whitelist Salad. More anti-virus guides coming soon!
        </div>
        <div style={{ paddingTop: '1rem' }}>
          <ExternalLink path="https://salad.zendesk.com/hc/en-us/articles/360032211151-How-to-Whitelist-Salad-in-Norton-Antivirus">
            Norton Antivirus
          </ExternalLink>
        </div>
        <div>
          <ExternalLink path="https://salad.zendesk.com/hc/en-us/articles/360031870772-How-to-Whitelist-Salad-in-Malwarebytes">
            Malwarebytes
          </ExternalLink>
        </div>
      </ErrorPage>
    )
  }
}
