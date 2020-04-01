import React, { Component } from 'react'

// Components
import { ErrorPage } from '../../../components/ErrorPage'
import { ExternalLinkListUnstyled } from '../../../components'

interface Props {
  onCloseClicked?: () => void
  showSendLog?: boolean
  onSendLog?: () => void
  avLinks: {readonly url: string, readonly text: string}[]
}

export class AntiVirusErrorPage extends Component<Props> {
  handleSendLogClicked = () => {
    const { onSendLog } = this.props

    if (onSendLog) onSendLog()
  }

  render() {
    const { showSendLog, onCloseClicked, avLinks } = this.props

    return (
      <ErrorPage
        title="Anti-Virus is Blocking Salad"
        onCloseClicked={onCloseClicked}
        showSendLog={showSendLog}
        onSendLog={this.handleSendLogClicked}
      >
        <div style={{ paddingBottom: '1rem' }}>
          Uh oh, looks like your anti-virus is blocking our miner from running. Follow the link below for a guide on how to whitelist Salad in your anti-virus.
        </div>

        <ExternalLinkListUnstyled list={avLinks} />
      </ErrorPage>
    )
  }
}
