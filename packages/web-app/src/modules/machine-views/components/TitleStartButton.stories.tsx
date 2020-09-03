import { action } from '@storybook/addon-actions'
import React from 'react'
import { MiningStatus } from '../../machine/models'
import { TitleStartButton } from './TitleStartButton'

export default {
  title: 'Modules/Machine/Title Start Button',
  component: TitleStartButton,
}

export const Enabled = () => <TitleStartButton onClick={action('click')} isEnabled={true} />

export const Disabled = () => <TitleStartButton onClick={action('click')} isEnabled={false} />

export const Stopped = () => (
  <TitleStartButton onClick={action('click')} isEnabled={true} status={MiningStatus.Stopped} />
)

export const Installing = () => (
  <TitleStartButton onClick={action('click')} isEnabled={true} status={MiningStatus.Installing} runningTime={10000} />
)

export const Initializing = () => (
  <TitleStartButton
    onClick={action('click')}
    isEnabled={true}
    status={MiningStatus.Initializing}
    runningTime={300000}
  />
)

export const Running = () => (
  <TitleStartButton onClick={action('click')} isEnabled={true} status={MiningStatus.Running} runningTime={6000000} />
)
