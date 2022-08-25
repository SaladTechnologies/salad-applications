import { action } from '@storybook/addon-actions'
import { number } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { DontLoseProgressPage } from './DontLoseProgress'

storiesOf('Modules/Machine/Pages', module)
  .addDecorator((storyFn) => (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add("Don't Lose Progress Page", () => {
    return (
      <DontLoseProgressPage
        onCloseClicked={action('close modal')}
        onStopPrepping={action('stop prepping')}
        prepTime={number('Prep Time', 600000)}
      />
    )
  })
