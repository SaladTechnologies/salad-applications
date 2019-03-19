import React from 'react'
import { storiesOf } from '@storybook/react'
import { TextField } from './TextField'

storiesOf('Components/Text Field', module)
  .add('blank', () => {
    return (
      <div>
        <div style={{ padding: '1rem' }}>
          <TextField />
        </div>
        <div style={{ backgroundColor: '#B2D530', padding: '1rem' }}>
          <TextField dark />
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
        <div style={{ backgroundColor: '#B2D530', padding: '1rem' }}>
          <TextField placeholder="Hello world" dark />
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
        <div style={{ backgroundColor: '#B2D530', padding: '1rem' }}>
          <TextField errorText="Required field" dark />
        </div>
      </div>
    )
  })
