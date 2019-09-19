import React, { Component } from 'react'

// Components
import { ErrorPage } from '../../../components/ErrorPage'
import { ExternalLink } from '../../../components'

interface Props {
  onCloseClicked?: () => void
  showSendLog?: boolean
  onSendLog?: () => void
}

export class CudaErrorPage extends Component<Props> {
  handleSendLogClicked = () => {
    const { onSendLog } = this.props

    if (onSendLog) onSendLog()
  }

  render() {
    const { showSendLog, onCloseClicked } = this.props

    return (
      <ErrorPage
        title="Incompatible Drivers"
        onCloseClicked={onCloseClicked}
        showSendLog={showSendLog}
        onSendLog={this.handleSendLogClicked}
      >
        <div>
          We’re detecting that your GPU drivers are incompatible with Salad. In order to get chopping you will need to
          update the the latest drivers.{' '}
          <ExternalLink path="https://www.nvidia.com/Download/index.aspx">NVIDIA Drivers</ExternalLink>{' '}
          <ExternalLink path="https://www.amd.com/en/support">AMD Drivers</ExternalLink>
        </div>
        <div style={{ paddingTop: '1rem' }}>
          If this issue persists, something else may be causing the problem. If so, please contact{' '}
          <ExternalLink path="https://www.salad.io/support/">Salad Support</ExternalLink>, or join the{' '}
          <ExternalLink path="https://discord.gg/XzyRcd8">Discord</ExternalLink> for updates.
        </div>
      </ErrorPage>
    )
  }
}
