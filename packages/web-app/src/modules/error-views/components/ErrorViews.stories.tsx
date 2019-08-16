import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ErrorPage, CudaErrorPage, UnknownErrorPage, AntiVirusErrorPage } from './ErrorPage'

storiesOf('Modules|Machine/Error Pages', module)
  .add('Error Page', () => (
    <ErrorPage title="Title goes here" onCloseClicked={action('close')}>
      Here are some details about the error and maybe some ways to fix the error.
    </ErrorPage>
  ))
  .add('CUDA Error Page', () => <CudaErrorPage onCloseClicked={action('close')} />)
  .add('Unknown Error Page', () => <UnknownErrorPage onCloseClicked={action('close')} />)
  .add('Antivirus Error Page', () => <AntiVirusErrorPage onCloseClicked={action('close')} />)
