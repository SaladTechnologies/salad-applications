import React, { Component } from 'react'
import { SmartLink } from '../../../components'
// Components
import { ErrorPage } from '../../../components/ErrorPage'

interface Props {
  onCloseClicked?: () => void
}

export class FallbackErrorPage extends Component<Props> {
  render() {
    return (
      <ErrorPage title="Initialization Error" onCloseClicked={this.props.onCloseClicked}>
        <div>
          Hey Chef, it looks like Salad can't run on your machine right now. Unfortunately, this happens sometimes
          despite having a compatible GPU. We're working hard to resolve this, but in the meantime please submit a bug
          report by following the link below.
        </div>
        <div style={{ paddingTop: '1rem' }}>
          <SmartLink to="https://www.salad.io/support/">Salad Support</SmartLink>
        </div>
      </ErrorPage>
    )
  }
}
