import React from 'react'
// @ts-ignore
import ReactHintFactory from 'react-hint'
import { Tooltip } from './components'
const ReactHint = ReactHintFactory(React)

/** The collection of all tooltips that are available to the app */
export const Tooltips = () => (
  <>
    {/* Default tooltip */}
    <ReactHint
      events
      autoPosition
      onRenderContent={(_: any, content: string) => {
        return <Tooltip text={content} />
      }}
    />

    {/* TODO: Add in any custom tooltips that should be accessible to components within the app */}
  </>
)
