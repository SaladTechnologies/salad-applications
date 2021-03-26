import { action } from '@storybook/addon-actions'
import { Meta } from '@storybook/react'
import { useEffect, useRef, useState } from 'react'
import { MiningStatus } from '../../machine/models'
import { getPreppingPercentage } from '../../salad-bowl/utils'
import { StartButton } from './StartButton'

export default {
  title: 'Modules/Machine/Start Button',
  component: StartButton,
} as Meta

export const Progress = () => (
  <div
    style={{
      backgroundColor: '#092234',
      color: 'white',
      padding: '2rem 1rem',
      display: 'flex',
      flexWrap: 'wrap',
    }}
  >
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>Not Running</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Stopped}
        runningTime={0}
        isRunning={false}
        percentage={0}
      />
    </div>
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>Installing</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Installing}
        runningTime={0}
        isRunning={true}
        percentage={0}
      />
    </div>
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>10 Seconds</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Initializing}
        runningTime={10000}
        isRunning={true}
        percentage={getPreppingPercentage(10000)}
      />
    </div>
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>30 Seconds</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Initializing}
        runningTime={30000}
        isRunning={true}
        percentage={getPreppingPercentage(30000)}
      />
    </div>
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>1 Minute</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Initializing}
        runningTime={60000}
        isRunning={true}
        percentage={getPreppingPercentage(60000)}
      />
    </div>
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>5 Minutes</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Initializing}
        runningTime={300000}
        isRunning={true}
        percentage={getPreppingPercentage(300000)}
      />
    </div>
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>10 Minutes</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Initializing}
        runningTime={600000}
        isRunning={true}
        percentage={getPreppingPercentage(600000)}
      />
    </div>
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>15 Minutes</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Initializing}
        runningTime={900000}
        isRunning={true}
        percentage={getPreppingPercentage(900000)}
      />
    </div>
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>20 Minutes</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Initializing}
        runningTime={1200000}
        isRunning={true}
        percentage={getPreppingPercentage(1200000)}
      />
    </div>
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>25 Minutes</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Initializing}
        runningTime={1500000}
        isRunning={true}
        percentage={getPreppingPercentage(1500000)}
      />
    </div>
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>30+ minutes</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Initializing}
        runningTime={1800000}
        isRunning={true}
        percentage={getPreppingPercentage(1800000)}
      />
    </div>
    <div style={{ marginRight: 25, marginBottom: 25 }}>
      <div style={{ marginBottom: 10 }}>Chopping</div>
      <StartButton
        onClick={action('click')}
        status={MiningStatus.Running}
        runningTime={2100000}
        isRunning={true}
        percentage={getPreppingPercentage(100)}
      />
    </div>
  </div>
)

export const ProgressSimulation = () => {
  const [miningStatus, setMiningStatus] = useState(MiningStatus.Stopped)
  const [isRunning, setRunning] = useState(false)
  const [percentage, setPercentage] = useState<number>(0)
  const [runningTime, setRunningTime] = useState<number>(0)

  useInterval(() => {
    setRunningTime(runningTime + 1000)
    setMiningStatus(MiningStatus.Initializing)
    setRunning(true)
    setPercentage(getPreppingPercentage(runningTime))
  }, 1000)

  return (
    <div
      style={{
        backgroundColor: '#092234',
        color: 'white',
        padding: '2rem',
      }}
    >
      <div style={{ marginBottom: 15 }}>Progress Simulation</div>
      <StartButton
        onClick={action('click')}
        status={miningStatus}
        runningTime={runningTime}
        isRunning={isRunning}
        percentage={percentage}
      />
    </div>
  )
}

export const Chopping = () => (
  <StartButton
    onClick={action('click')}
    status={MiningStatus.Running}
    runningTime={1400000}
    isRunning={true}
    percentage={getPreppingPercentage(100)}
  />
)

export const NotCompatible = () => (
  <StartButton
    onClick={action('click')}
    onClickError={action('clicked when not compatible')}
    isRunning={false}
    percentage={getPreppingPercentage(0)}
  />
)

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void | null>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
    return
  }, [delay])
}
