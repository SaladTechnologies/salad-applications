import React, { Component } from 'react'

// Components
import { ErrorPage } from '../../../components/ErrorPage'

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
          <a
            href="https://salad.zendesk.com/hc/en-us/articles/360032211151-How-to-Whitelist-Salad-in-Norton-Antivirus"
            target="_blank"
          >
            Norton Antivirus
          </a>
        </div>
        <div>
          <a
            href="https://salad.zendesk.com/hc/en-us/articles/360031870772-How-to-Whitelist-Salad-in-Malwarebytes"
            target="_blank"
          >
            Malwarebytes
          </a>
        </div>
      </ErrorPage>
    )
  }
}
