import React, { Component } from 'react'
import { ExternalLinkListUnstyled } from '../../../components'
// Components
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
          Uh oh, looks like your anti-virus is blocking our miner from running. Follow the link below for a guide on how
          to whitelist Salad in your anti-virus.
        </div>

        <ExternalLinkListUnstyled list={avLinks} />
      </ErrorPage>
    )
  }
}
