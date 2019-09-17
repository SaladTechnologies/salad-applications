import React from 'react'
import { storiesOf } from '@storybook/react'
import { StartButton } from './StartButton'
import { action } from '@storybook/addon-actions'
import { CompatibilityCheckPage } from './CompatibilityCheckPage'

storiesOf('Modules|Machine/Compatibility Check', module)
  .add('is checking', () => <CompatibilityCheckPage isChecking />)
  .add('invalid gpus', () => (
    <CompatibilityCheckPage
      onNext={action('next')}
      validGPUs={false}
      validOS={true}
      gpuList={['Intel(R) UHD Graphics 630', 'NVIDIA GeForce GTX 1060 with Max-Q']}
    />
  ))
  .add('invalid os', () => <CompatibilityCheckPage onNext={action('next')} validGPUs={true} validOS={false} />)

storiesOf('Modules|Machine', module).add('Start Button', () => {
  const style = { padding: '1rem', color: 'white' }
  let balance = 123.456789999999999999999999
  let lifetimeBalance = balance * 100
  return (
    <div style={{ backgroundColor: '#092234', padding: '1rem' }}>
      <div style={style}>
        Not running
        <StartButton
          startEnabled={true}
          isRunning={false}
          balance={balance}
          lifetimeBalance={lifetimeBalance}
          onClick={action('click)')}
        />
      </div>
      <div style={style}>
        Running
        <StartButton
          startEnabled={true}
          isRunning={true}
          balance={balance}
          lifetimeBalance={lifetimeBalance}
          onClick={action('click)')}
        />
      </div>
      <div style={style}>
        Disabled
        <StartButton
          startEnabled={false}
          isRunning={false}
          balance={balance}
          lifetimeBalance={lifetimeBalance}
          onClick={action('click)')}
        />
      </div>
      <div style={style}>
        Disabled, undefined values
        <StartButton balance={undefined} lifetimeBalance={undefined} onClick={action('click)')} />
      </div>
    </div>
  )
})
