import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react'
import { MiningStatus } from '../../machine/models'
import { TitleStartButton } from './TitleStartButton'

export default {
  title: 'Modules/Machine/Title Start Button',
  component: TitleStartButton,
} as Meta

export const Enabled = () => (
  <TitleStartButton
    onClick={action('click')}
    isDisabled={boolean('Is Disabled', false)}
    isRunning={boolean('Is Running', false)}
    notCompatible={boolean('Not Compatible', false)}
  />
)

export const Disabled = () => (
  <TitleStartButton
    onClick={action('click')}
    isDisabled={boolean('Is Disabled', true)}
    isRunning={boolean('Is Running', false)}
    notCompatible={boolean('Not Compatible', false)}
  />
)

export const Stopped = () => (
  <TitleStartButton
    onClick={action('click')}
    isDisabled={boolean('Is Disabled', false)}
    status={MiningStatus.Stopped}
    isRunning={boolean('Is Running', false)}
    notCompatible={boolean('Not Compatible', false)}
  />
)

export const Installing = () => (
  <TitleStartButton
    onClick={action('click')}
    status={MiningStatus.Installing}
    runningTime={10000}
    isDisabled={boolean('Is Disabled', false)}
    isRunning={boolean('Is Running', false)}
    notCompatible={boolean('Not Compatible', false)}
  />
)

export const Initializing = () => (
  <TitleStartButton
    onClick={action('click')}
    status={MiningStatus.Initializing}
    runningTime={300000}
    isDisabled={boolean('Is Disabled', false)}
    isRunning={boolean('Is Running', false)}
    notCompatible={boolean('Not Compatible', false)}
  />
)

export const Running = () => (
  <TitleStartButton
    onClick={action('click')}
    status={MiningStatus.Running}
    runningTime={6000000}
    isDisabled={boolean('Is Disabled', false)}
    isRunning={boolean('Is Running', false)}
    notCompatible={boolean('Not Compatible', false)}
  />
)

export const WithError = () => (
  <TitleStartButton
    onClick={action('click')}
    onClickError={action('click error')}
    isDisabled={boolean('Is Disabled', false)}
    isRunning={boolean('Is Running', false)}
    notCompatible={boolean('Not Compatible', true)}
    status={MiningStatus.Stopped}
  />
)
