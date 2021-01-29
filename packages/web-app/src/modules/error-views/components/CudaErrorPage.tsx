import { Component } from 'react'
import { SmartLink } from '../../../components'
import { ErrorPage } from '../../../components/ErrorPage'

interface Props {
  onCloseClicked?: () => void
}

const amdLabel = 'AMD Drivers'
const discordLabel = 'Discord'
const nvidiaLabel = 'NVIDIA Drivers'
const supportLabel = 'Salad Support'

export class CudaErrorPage extends Component<Props> {
  render() {
    const { onCloseClicked } = this.props

    return (
      <ErrorPage title="Incompatible Drivers" onCloseClicked={onCloseClicked}>
        <div>
          We’re detecting that your GPU drivers are incompatible with Salad. In order to get chopping you will need to
          update your drivers to the latest version.{' '}
          <SmartLink to="https://www.nvidia.com/Download/index.aspx" trackingInfo={{ label: nvidiaLabel }}>
            {nvidiaLabel}
          </SmartLink>{' '}
          <SmartLink to="https://www.amd.com/en/support" trackingInfo={{ label: amdLabel }}>
            {amdLabel}
          </SmartLink>
        </div>
        <div style={{ paddingTop: '1rem' }}>
          If this issue persists, something else may be causing the problem. If so, please contact{' '}
          <SmartLink to="https://www.salad.io/support/" trackingInfo={{ label: supportLabel }}>
            {supportLabel}
          </SmartLink>
          , or join the{' '}
          <SmartLink to="https://discord.gg/XzyRcd8" trackingInfo={{ label: discordLabel }}>
            {discordLabel}
          </SmartLink>{' '}
          for updates.
        </div>
      </ErrorPage>
    )
  }
}
