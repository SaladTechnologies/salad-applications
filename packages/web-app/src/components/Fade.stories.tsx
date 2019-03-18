import React from 'react'
import { storiesOf } from '@storybook/react'
import { Fade } from './Fade'

storiesOf('Components/Fade', module).add('fades', () => {
  let style = { height: '50px', margin: '1px 0' }
  return (
    <div style={{ backgroundColor: 'green' }}>
      <Fade style={style} direction="up" />
      <Fade style={style} direction="down" />
    </div>
  )
})
