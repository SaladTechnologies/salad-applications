import React from 'react'
import { storiesOf } from '@storybook/react'
import { MachineSummaryView } from './MachineSummaryView'
import { Machine } from '../../machine/models/Machine'
import { StartButton } from './StartButton'
import { action } from '@storybook/addon-actions'
import { CompatibilityCheckPage } from './CompatibilityCheckPage'
import { ErrorPage, CudaErrorPage, UnknownErrorPage } from './ErrorPage'
import { Earnings } from '../../balance/models/Earnings'

const getMachines = (num: number): Machine[] => {
  let array: Machine[] = new Array()

  for (var i = 0; i < num; i++) {
    let m = new Machine()
    m.name = `${i}-fjadoifoi-fdajfoibs-fda-dfafa-fdaffff-adfa`
    array[i] = m
  }

  return array
}

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

storiesOf('Modules|Machine/Error Pages', module)
  .add('Error Page', () => (
    <ErrorPage title="Title goes here" onCloseClicked={action('close')}>
      Here are some details about the error and maybe some ways to fix the error.
    </ErrorPage>
  ))
  .add('CUDA Error Page', () => <CudaErrorPage onCloseClicked={action('close')} />)
  .add('Unknown Error Page', () => <UnknownErrorPage onCloseClicked={action('close')} />)

storiesOf('Modules|Machine', module)
  .add('Summary View', () => (
    <div
      style={{
        backgroundColor: '#092234',
      }}
    >
      <MachineSummaryView machines={getMachines(3)} />
    </div>
  ))
  .add('Start Button', () => {
    const style = { padding: '1rem', color: 'white' }
    let balance = 12345.6789999999999999999999
    let earning: Earnings = {
      lastDayEarnings: 0.12345678999999999,
      lastHourEarnings: 0.12345678999999999,
    }
    return (
      <div style={{ backgroundColor: '#092234', padding: '1rem' }}>
        <div style={style}>
          Not running
          <StartButton
            startEnabled={true}
            isRunning={false}
            balance={balance}
            earnings={earning}
            onClick={action('click)')}
          />
        </div>
        <div style={style}>
          Running
          <StartButton
            startEnabled={true}
            isRunning={true}
            balance={balance}
            earnings={earning}
            onClick={action('click)')}
          />
        </div>
        <div style={style}>
          Disabled, 0 rate
          <StartButton
            startEnabled={false}
            isRunning={false}
            balance={balance}
            earnings={{ lastDayEarnings: 0, lastHourEarnings: 0 }}
            onClick={action('click)')}
          />
        </div>
        <div style={style}>
          Disabled, undefined rate
          <StartButton balance={undefined} earnings={undefined} onClick={action('click)')} />
        </div>
      </div>
    )
  })
