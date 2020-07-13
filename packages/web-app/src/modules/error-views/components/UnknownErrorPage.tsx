import React, { Component } from 'react'

// Components
import { ErrorPage } from '../../../components/ErrorPage'
import { SmartLink } from '../../../components'

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
          <SmartLink to="https://www.salad.io/support/">Salad Support</SmartLink>, join the
          <SmartLink to="https://discord.gg/XzyRcd8"> Discord </SmartLink> for updates and send us your logs.
        </div>
      </ErrorPage>
    )
  }
}
