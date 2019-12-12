import React from 'react'
import { storiesOf } from '@storybook/react'
import { AnimatedProgressBar } from './AnimatedProgressBar'

storiesOf('Components/Animated Progress', module).add('progress bar ', () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '5rem' }}>
      <div style={{ padding: '1rem' }}>
        <AnimatedProgressBar progress={0} />
      </div>
      <div style={{ padding: '1rem' }}>
        <AnimatedProgressBar progress={25} />
      </div>
      <div style={{ padding: '1rem' }}>
        <AnimatedProgressBar progress={50} />
      </div>
      <div style={{ padding: '1rem' }}>
        <AnimatedProgressBar progress={75} />
      </div>
      <div style={{ padding: '1rem' }}>
        <AnimatedProgressBar progress={100} />
      </div>
    </div>
  )
})
