import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { LoadingPage } from './LoadingPage'

storiesOf('Components/Loading Page', module)
  .add('Default', () => {
    return <LoadingPage onDidMount={action('DidMount callback')} />
  })
  .add('Custom Text', () => {
    return <LoadingPage text={'Hello storybook'} />
  })
