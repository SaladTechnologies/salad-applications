import React, { Component } from 'react'

// Components
import { ErrorPage } from '../../../components/ErrorPage'

interface Props {
  onCloseClicked?: () => void
  showSendLog?: boolean
  onSendLog?: () => void
  avLinks: {readonly url: string, readonly text: string}[]
}

export class NoPluginErrorPage extends Component<Props> {
  handleSendLogClicked = () => {
    const { onSendLog } = this.props

    if (onSendLog) onSendLog()
  }

  render() {
    const { showSendLog, onCloseClicked } = this.props

    return (
      <ErrorPage
        title="There are no plugins available!"
        onCloseClicked={onCloseClicked}
        showSendLog={showSendLog}
        onSendLog={this.handleSendLogClicked}
      >
        <div style={{ paddingBottom: '1rem' }}>
          Oh no! Your machine seems to be having issues with our available earning methods.
        </div>
      </ErrorPage>
    )
  }
}
