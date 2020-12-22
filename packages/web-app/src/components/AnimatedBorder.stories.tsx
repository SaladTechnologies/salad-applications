import { storiesOf } from '@storybook/react'
import { AnimatedBorder } from './AnimatedBorder'

storiesOf('Components/Animated Border', module).add('default', () => {
  return (
    <div style={{ backgroundColor: '#092234' }}>
      <div style={{ padding: '0rem' }}>
        <AnimatedBorder>
          <div style={{ color: 'white' }}>Boring borders :(</div>
        </AnimatedBorder>
      </div>
      <div style={{ padding: '0rem' }}>
        <AnimatedBorder animating>
          <div style={{ color: 'white' }}>Animated borders!!!</div>
        </AnimatedBorder>
      </div>
    </div>
  )
})
