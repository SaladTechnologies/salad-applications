import React, { Component } from 'react'

// Components
import { ErrorPage } from '../../../components/ErrorPage'
import { ExternalLink } from '../../../components'

interface Props {
  onCloseClicked?: () => void
  showSendLog?: boolean
  onSendLog?: () => void
}

export class UnknownErrorPage extends Component<Props> {
  handleSendLogClicked = () => {
    const { onSendLog } = this.props

    if (onSendLog) onSendLog()
  }

  render() {
    const { showSendLog, onCloseClicked } = this.props

    return (
      <ErrorPage
        title="Oops. Something went wrong."
        onCloseClicked={onCloseClicked}
        showSendLog={showSendLog}
        onSendLog={this.handleSendLogClicked}
      >
        <div>
          We are sorry for the inconvenience, Salad doesn't seem to be working properly. If this issue persists,
          something else may be causing the problem. If so, please contact
          <ExternalLink path="https://www.salad.io/support/">Salad Support</ExternalLink>, join the
          <ExternalLink path="https://discord.gg/XzyRcd8"> Discord </ExternalLink> for updates and send us your logs.
        </div>
      </ErrorPage>
    )
  }
}
