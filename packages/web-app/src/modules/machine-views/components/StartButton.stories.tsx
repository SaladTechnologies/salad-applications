import React from 'react'
import { storiesOf } from '@storybook/react'
import { StartButton } from './StartButton'
import { action } from '@storybook/addon-actions'

let balance = 123.456789999999999999999999
let lifetimeBalance = balance * 100

storiesOf('Modules|Machine/Start Button', module)
  .add('(all)', () => {
    const style = { padding: '1rem', color: 'white' }
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
  .add('Not Running', () => {
    return (
      <StartButton
        startEnabled={true}
        isRunning={false}
        balance={balance}
        lifetimeBalance={lifetimeBalance}
        onClick={action('click)')}
      />
    )
  })
  .add('Running', () => {
    return (
      <StartButton
        startEnabled={true}
        isRunning={true}
        balance={balance}
        lifetimeBalance={lifetimeBalance}
        onClick={action('click)')}
      />
    )
  })
  .add('Disabled', () => {
    return (
      <StartButton
        startEnabled={false}
        isRunning={false}
        balance={balance}
        lifetimeBalance={lifetimeBalance}
        onClick={action('click)')}
      />
    )
  })
  .add(' Disabled, undefined values', () => {
    return <StartButton balance={undefined} lifetimeBalance={undefined} onClick={action('click)')} />
  })
