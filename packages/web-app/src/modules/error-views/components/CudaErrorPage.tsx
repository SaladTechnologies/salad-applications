import React, { Component } from 'react'
import { SmartLink } from '../../../components'
// Components
import { ErrorPage } from '../../../components/ErrorPage'

interface Props {
  onCloseClicked?: () => void
}

export class CudaErrorPage extends Component<Props> {
  render() {
    const { onCloseClicked } = this.props

    return (
      <ErrorPage title="Incompatible Drivers" onCloseClicked={onCloseClicked}>
        <div>
          We’re detecting that your GPU drivers are incompatible with Salad. In order to get chopping you will need to
          update your drivers to the latest version.{' '}
          <SmartLink to="https://www.nvidia.com/Download/index.aspx">NVIDIA Drivers</SmartLink>{' '}
          <SmartLink to="https://www.amd.com/en/support">AMD Drivers</SmartLink>
        </div>
        <div style={{ paddingTop: '1rem' }}>
          If this issue persists, something else may be causing the problem. If so, please contact{' '}
          <SmartLink to="https://www.salad.io/support/">Salad Support</SmartLink>, or join the{' '}
          <SmartLink to="https://discord.gg/XzyRcd8">Discord</SmartLink> for updates.
        </div>
      </ErrorPage>
    )
  }
}
