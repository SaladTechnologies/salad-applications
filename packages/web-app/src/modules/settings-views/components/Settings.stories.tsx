import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import { Settings } from './Settings'

storiesOf('Settings', module)
  .add('Settings', () => {
    // return <Settings onCloseClicked={action('close')}>Hello!</Settings>
    return <Settings>Hello!</Settings>
  })
