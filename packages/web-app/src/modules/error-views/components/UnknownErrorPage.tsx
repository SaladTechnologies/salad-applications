import { Component } from 'react'
import { SmartLink } from '../../../components'
import { ErrorPage } from '../../../components/ErrorPage'

interface Props {
  onCloseClicked?: () => void
}

export class UnknownErrorPage extends Component<Props> {
  render() {
    const { onCloseClicked } = this.props

    return (
      <ErrorPage title="Oops. Something went wrong." onCloseClicked={onCloseClicked}>
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
