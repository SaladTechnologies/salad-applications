import React from 'react'
import { storiesOf } from '@storybook/react'
import { Fade } from './Fade'

storiesOf('Components/Fade', module).add('fades', () => {
  let style = { width: '300px', height: '50px', margin: '.5rem 0' }
  return (
    <div style={{ backgroundColor: 'green' }}>
      <Fade style={style} direction="up" />
      <Fade style={style} direction="down" />
    </div>
  )
})
