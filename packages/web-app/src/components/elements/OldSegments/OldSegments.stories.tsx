import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { OldSegments } from './OldSegments'

const segmentOptions = [
  { name: '24 Hours', action: action('clicked 24HR') },
  { name: '7 Days', action: action('clicked 7 Days') },
  { name: '30 Days', action: action('clicked 30 Days') },
]

storiesOf('Components/Segments', module).add('default', () => {
  return (
    <div>
      <OldSegments options={segmentOptions} />
    </div>
  )
})
