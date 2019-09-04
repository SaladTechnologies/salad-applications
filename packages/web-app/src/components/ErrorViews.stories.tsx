import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ErrorPage } from './ErrorPage'

storiesOf('Modules|Machine/Error Pages', module)
  .add('Error Page', () => (
    <ErrorPage title="Title goes here" onCloseClicked={action('close')}>
      Here are some details about the error and maybe some ways to fix the error.
    </ErrorPage>
  ))
