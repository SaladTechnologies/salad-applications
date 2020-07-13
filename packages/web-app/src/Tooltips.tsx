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
      onRenderContent={(target: any, content: string) => {
        console.error(target)
        return <Tooltip text={content} />
      }}
      // onRenderContent={() => tooltip || (text && <Tooltip width={'14rem'} text={text} />)}
    />

    {/* TODO: Add in any custom tooltips that should be accessible to components within the app */}
  </>
)
