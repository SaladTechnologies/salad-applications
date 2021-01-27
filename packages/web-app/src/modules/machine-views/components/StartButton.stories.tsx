import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react'
import { MiningStatus } from '../../machine/models'
import { StartButton } from './StartButton'

export default {
  title: 'Modules/Machine/Start Button',
  component: StartButton,
} as Meta

export const Status = () => (
  <div style={{ backgroundColor: '#092234', color: 'white', padding: '1rem', display: 'flex', flexWrap: 'wrap' }}>
    <div>
      Stopped
      <StartButton
        notCompatible={boolean('Not Compatible', false)}
        isRunning={boolean('Is Running', false)}
        status={MiningStatus.Stopped}
        onClick={action('click')}
      />
    </div>
    <div>
      Installing
      <StartButton
        notCompatible={boolean('Not Compatible', false)}
        isRunning={boolean('Is Running', false)}
        status={MiningStatus.Installing}
        onClick={action('click')}
      />
    </div>
    <div>
      Initializing
      <StartButton
        notCompatible={boolean('Not Compatible', false)}
        isRunning={boolean('Is Running', false)}
        status={MiningStatus.Initializing}
        onClick={action('click')}
      />
    </div>
    <div>
      Running
      <StartButton
        notCompatible={boolean('Not Compatible', false)}
        isRunning={boolean('Is Running', false)}
        status={MiningStatus.Running}
        onClick={action('click')}
      />
    </div>
    <div>
      Disabled
      <StartButton
        notCompatible={true}
        isRunning={boolean('Is Running', false)}
        onClick={action('should not happen!!')}
      />
    </div>
  </div>
)

export const Example0Sec = () => (
  <StartButton
    notCompatible={boolean('Not Compatible', false)}
    runningTime={0}
    isRunning={boolean('Is Running', false)}
    status={MiningStatus.Running}
  />
)
export const Example1Sec = () => (
  <StartButton
    notCompatible={boolean('Not Compatible', false)}
    runningTime={1000}
    isRunning={boolean('Is Running', true)}
    status={MiningStatus.Running}
  />
)
export const Example2Sec = () => (
  <StartButton
    notCompatible={boolean('Not Compatible', false)}
    runningTime={1000 * 2}
    isRunning={boolean('Is Running', true)}
    status={MiningStatus.Running}
  />
)
export const Example1Min = () => (
  <StartButton
    notCompatible={boolean('Not Compatible', false)}
    runningTime={1000 * 60}
    isRunning={boolean('Is Running', true)}
    status={MiningStatus.Running}
  />
)
export const Example2Min = () => (
  <StartButton
    notCompatible={boolean('Not Compatible', false)}
    runningTime={1000 * 60 * 2}
    isRunning={boolean('Is Running', true)}
    status={MiningStatus.Running}
  />
)
export const Example1Hr = () => (
  <StartButton
    notCompatible={boolean('Not Compatible', false)}
    runningTime={1000 * 60 * 60}
    isRunning={boolean('Is Running', true)}
    status={MiningStatus.Running}
  />
)
export const Example2Hr = () => (
  <StartButton
    notCompatible={boolean('Not Compatible', false)}
    runningTime={1000 * 60 * 60 * 2}
    isRunning={boolean('Is Running', true)}
    status={MiningStatus.Running}
  />
)
export const Example1Day = () => (
  <StartButton
    notCompatible={boolean('Not Compatible', false)}
    runningTime={1000 * 60 * 60 * 24}
    isRunning={boolean('Is Running', true)}
    status={MiningStatus.Running}
  />
)
export const Example2Day = () => (
  <StartButton
    notCompatible={boolean('Not Compatible', false)}
    runningTime={1000 * 60 * 60 * 24 * 2}
    isRunning={boolean('Is Running', true)}
    status={MiningStatus.Running}
  />
)
