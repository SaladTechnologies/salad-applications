import { number } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { ProgressBar } from './ProgressBar'
import { VerticalProgress } from './VerticalProgress'

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
