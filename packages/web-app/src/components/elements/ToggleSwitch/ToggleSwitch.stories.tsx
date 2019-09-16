import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import { ToggleSwitch } from './ToggleSwitch'

storiesOf('Components/ToggleSwitch', module)
  .add('ToggleSwitch', () => {
    return <ToggleSwitch></ToggleSwitch>
  })