import { storiesOf } from '@storybook/react'
import { TextField } from './TextField'

storiesOf('Components/Text Field', module)
  .add('blank', () => {
    return (
      <div>
        <div style={{ padding: '1rem' }}>
          <TextField />
        </div>
        <div style={{ padding: '1rem' }}>
          <TextField />
        </div>
      </div>
    )
  })
  .add('with placeholder', () => {
    return (
      <div>
        <div style={{ padding: '1rem' }}>
          <TextField placeholder="Hello world" />
        </div>
        <div style={{ padding: '1rem' }}>
          <TextField placeholder="Hello world" />
        </div>
      </div>
    )
  })
  .add('with error', () => {
    return (
      <div>
        <div style={{ padding: '1rem' }}>
          <TextField errorText="Required field" />
        </div>
        <div style={{ padding: '1rem' }}>
          <TextField errorText="Required field" />
        </div>
      </div>
    )
  })
