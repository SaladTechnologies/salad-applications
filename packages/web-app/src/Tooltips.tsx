import * as React from 'react'
import ReactHintFactory from 'react-hint'
import { Tooltip } from './components'

const ReactHint = ReactHintFactory(React)

export const Tooltips = () => (
  <ReactHint
    events
    autoPosition
    onRenderContent={(_: any, content: string) => {
      return <Tooltip text={content} />
    }}
  />
)
