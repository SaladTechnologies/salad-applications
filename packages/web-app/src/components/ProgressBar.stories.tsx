import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'
import { VerticalProgress } from './VerticalProgress'
import { ProgressBar } from './ProgressBar'

storiesOf('Components/Progress', module)
  .add('vertical progress bar ', () => {
    return (
      <div style={{ height: '200px' }}>
        <VerticalProgress
          progress={number('Progress', 50, {
            range: true,
            min: 0,
            max: 100,
            step: 0.1,
          })}
        />
      </div>
    )
  })
  .add('progress bar ', () => {
    return (
      <div>
        <ProgressBar
          progress={number('Progress', 50, {
            range: true,
            min: 0,
            max: 100,
            step: 0.1,
          })}
        />
      </div>
    )
  })
