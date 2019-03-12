import React from 'react'
import { storiesOf } from '@storybook/react'
import { TextField } from './TextField'

storiesOf('Components/Text Field', module)
  .add('blank', () => {
    return <TextField />
  })
  .add('with placeholder', () => {
    return <TextField placeholder="Hello world" />
  })
  .add('with error', () => {
    return <TextField errorText="Required field" />
  })
