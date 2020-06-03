import { action } from '@storybook/addon-actions'
import React from 'react'
import { MiningStatus } from '../../machine/models'
import { StartButton } from './StartButton'

export default {
  title: 'Modules/Machine/Start Button',
  component: StartButton,
}

export const Status = () => (
  <div style={{ backgroundColor: '#092234', color: 'white', padding: '1rem', display: 'flex', flexWrap: 'wrap' }}>
    <div>
      Stopped
      <StartButton isEnabled={true} status={MiningStatus.Stopped} onClick={action('click')} />
    </div>
    <div>
      Installing
      <StartButton isEnabled={true} status={MiningStatus.Installing} onClick={action('click')} />
    </div>
    <div>
      Initializing
      <StartButton isEnabled={true} status={MiningStatus.Initializing} onClick={action('click')} />
    </div>
    <div>
      Running
      <StartButton isEnabled={true} status={MiningStatus.Running} onClick={action('click')} />
    </div>
    <div>
      Disabled
      <StartButton onClick={action('should not happen!!')} />
    </div>
  </div>
)

export const Example0Sec = () => <StartButton runningTime={0} status={MiningStatus.Running} />
export const Example1Sec = () => <StartButton runningTime={1000} status={MiningStatus.Running} />
export const Example2Sec = () => <StartButton runningTime={1000 * 2} status={MiningStatus.Running} />
export const Example1Min = () => <StartButton runningTime={1000 * 60} status={MiningStatus.Running} />
export const Example2Min = () => <StartButton runningTime={1000 * 60 * 2} status={MiningStatus.Running} />
export const Example1Hr = () => <StartButton runningTime={1000 * 60 * 60} status={MiningStatus.Running} />
export const Example2Hr = () => <StartButton runningTime={1000 * 60 * 60 * 2} status={MiningStatus.Running} />
export const Example1Day = () => <StartButton runningTime={1000 * 60 * 60 * 24} status={MiningStatus.Running} />
export const Example2Day = () => <StartButton runningTime={1000 * 60 * 60 * 24 * 2} status={MiningStatus.Running} />
