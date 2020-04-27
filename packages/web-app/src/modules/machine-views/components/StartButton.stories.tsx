import React from 'react'
import { storiesOf } from '@storybook/react'
import { StartButton } from './StartButton'
import { action } from '@storybook/addon-actions'
import { MiningStatus } from '../../machine/models'

storiesOf('Modules|Machine', module).add('Start Button', () => {
  return (
    <div style={{ backgroundColor: '#092234', color: 'white', padding: '1rem', display: 'flex' }}>
      Stopped
      <StartButton isEnabled={true} status={MiningStatus.Stopped} onClick={action('click')} />
      Installing
      <StartButton isEnabled={true} status={MiningStatus.Installing} onClick={action('click')} />
      Initializing
      <StartButton isEnabled={true} status={MiningStatus.Initializing} onClick={action('click')} />
      Running
      <StartButton isEnabled={true} status={MiningStatus.Running} onClick={action('click')} />
      Disabled
      <StartButton onClick={action('should not happen!!')} />
    </div>
  )
})
