import { number } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { loremIpsum } from 'lorem-ipsum'
import { ScrollableContent } from './ScrollableContent'

storiesOf('Components/ScrollableContent', module).add('default', () => {
  return (
    <div>
      <ScrollableContent
        maxHeight={number('Max Height', 300)}
        minHeight={number('Min Height', 200)}
        maxWidth={number('Width', 500)}
      >
        <div style={{ color: 'white' }}>{loremIpsum({ count: number('Sentences', 20) })}</div>
      </ScrollableContent>
    </div>
  )
})
