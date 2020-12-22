import { Component } from 'react'
import { ExternalLinkListUnstyled } from '../../../components'
import { ErrorPage } from '../../../components/ErrorPage'

interface Props {
  onCloseClicked?: () => void
  avLinks: { readonly url: string; readonly text: string }[]
}

export class AntiVirusErrorPage extends Component<Props> {
  render() {
    const { onCloseClicked, avLinks } = this.props

    return (
      <ErrorPage title="Anti-Virus is Blocking Salad" onCloseClicked={onCloseClicked}>
        <div style={{ paddingBottom: '1rem' }}>
          Uh oh! It looks like your anti-virus software is blocking one or more of our miners. We may be able to get
          another miner running, but you're not in tip-top shape! You should expect lower earnings until this issue is
          resolved. You can find helpful details and walkthroughs on our support website:
        </div>
        <ExternalLinkListUnstyled list={avLinks} />
      </ErrorPage>
    )
  }
}
