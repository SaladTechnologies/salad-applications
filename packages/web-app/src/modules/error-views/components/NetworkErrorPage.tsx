import { Component } from 'react'
import { ErrorPage } from '../../../components/ErrorPage'

interface Props {
  onCloseClicked?: () => void
}

export class NetworkErrorPage extends Component<Props> {
  render() {
    const { onCloseClicked } = this.props

    return (
      <ErrorPage title="Network Error X_x" onCloseClicked={onCloseClicked}>
        <div>It appears this we are having trouble connecting to the Salad mining pool.</div>
      </ErrorPage>
    )
  }
}
