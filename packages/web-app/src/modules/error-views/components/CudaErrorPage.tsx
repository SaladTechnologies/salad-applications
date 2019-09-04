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
        title="Insufficient CUDA Driver"
        onCloseClicked={onCloseClicked}
        showSendLog={showSendLog}
        onSendLog={this.handleSendLogClicked}
      >
        <div>
          Just a quick warning that we’re detecting an insufficient{' '}
          <ExternalLink path="https://en.wikipedia.org/wiki/CUDA">CUDA </ExternalLink>
          version for your graphics card. This can cause major instability with Salad. We highly recommend{' '}
          <ExternalLink path="https://www.windowscentral.com/how-properly-update-device-drivers-windows-10">
            downloading the latest GPU drivers{' '}
          </ExternalLink>
          to make sure it’s performing at tip-top shape. No dull knives in the Salad Kitchen!
        </div>
        <div style={{ paddingTop: '1rem' }}>
          If this issue persists, something else may be causing the problem. If so, please contact Salad Support, you
          can either chat with us on <ExternalLink path="https://salad.zendesk.com/hc/en-us">Zendesk </ExternalLink>, or
          join the
          <ExternalLink path="https://discord.gg/XzyRcd8"> Discord </ExternalLink> for live help.
        </div>
      </ErrorPage>
    )
  }
}
