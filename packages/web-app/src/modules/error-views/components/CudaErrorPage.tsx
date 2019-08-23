import React, { Component } from 'react'

// Components
import { ErrorPage } from '../../../components/ErrorPage'

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
        title="Insufficient CUDA Driver"
        onCloseClicked={onCloseClicked}
        showSendLog={showSendLog}
        onSendLog={this.handleSendLogClicked}
      >
        <div>
          Just a quick warning that we’re detecting an insufficient{' '}
          <a href="https://en.wikipedia.org/wiki/CUDA">CUDA </a>
          version for your graphics card. This can cause major instability with Salad. We highly recommend{' '}
          <a href="https://www.windowscentral.com/how-properly-update-device-drivers-windows-10">
            downloading the latest GPU drivers{' '}
          </a>
          to make sure it’s performing at tip-top shape. No dull knives in the Salad Kitchen!
        </div>
        <div style={{ paddingTop: '1rem' }}>
          If this issue persists, something else may be causing the problem. If so, please contact Salad Support, you
          can either chat with us on <a href="https://salad.zendesk.com/hc/en-us">Zendesk </a>, or join the
          <a href="https://discord.gg/XzyRcd8"> Discord </a> for live help.
        </div>
      </ErrorPage>
    )
  }
}
