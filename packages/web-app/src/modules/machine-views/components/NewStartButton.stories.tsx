import { action } from '@storybook/addon-actions'
import { Meta } from '@storybook/react'
import { useEffect, useRef, useState } from 'react'
import { MiningStatus } from '../../machine/models'
import { NewStartButton } from './NewStartButton'

export default {
  title: 'Modules/Machine/New Start Button',
  component: NewStartButton,
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
    <div style={{ marginRight: 25 }}>
      <div style={{ marginBottom: 10 }}>Not Running</div>
      <NewStartButton
        onClick={action('click')}
        progress={0}
        status={MiningStatus.Stopped}
        runningTime={0}
        isRunning={false}
      />
    </div>
    <div style={{ marginRight: 25 }}>
      <div style={{ marginBottom: 10 }}>Installing</div>
      <NewStartButton
        onClick={action('click')}
        progress={0}
        status={MiningStatus.Installing}
        runningTime={0}
        isRunning={true}
      />
    </div>
    <div style={{ marginRight: 25 }}>
      <div style={{ marginBottom: 10 }}>Under 1 Minute</div>
      <NewStartButton
        onClick={action('click')}
        progress={0.1}
        status={MiningStatus.Initializing}
        runningTime={30000}
        isRunning={true}
      />
    </div>
    <div style={{ marginRight: 25 }}>
      <div style={{ marginBottom: 10 }}>Under 10 Minutes</div>
      <NewStartButton
        onClick={action('click')}
        progress={0.2}
        status={MiningStatus.Initializing}
        runningTime={500000}
        isRunning={true}
      />
    </div>
    <div style={{ marginRight: 25 }}>
      <div style={{ marginBottom: 10 }}>Under 20 Minutes</div>
      <NewStartButton
        onClick={action('click')}
        progress={0.3}
        status={MiningStatus.Initializing}
        runningTime={1100000}
        isRunning={true}
      />
    </div>
    <div style={{ marginRight: 25 }}>
      <div style={{ marginBottom: 10 }}>Over 20 Minutes</div>
      <NewStartButton
        onClick={action('click')}
        progress={0.4}
        status={MiningStatus.Initializing}
        runningTime={1300000}
        isRunning={true}
      />
    </div>
    <div style={{ marginRight: 25 }}>
      <div style={{ marginBottom: 10 }}>Chopping</div>
      <NewStartButton
        onClick={action('click')}
        progress={0}
        status={MiningStatus.Running}
        runningTime={1400000}
        isRunning={true}
      />
    </div>
  </div>
)

export const ProgressSimulation = () => {
  const [miningStatus, setMiningStatus] = useState(MiningStatus.Stopped)
  const [runTime, setRunTime] = useState(0)
  const [counter, setCounter] = useState(1)
  const [isRunning, setRunning] = useState(false)
  const [progress, setProgress] = useState<number>(0)

  useInterval(() => {
    if (counter === 0) {
      setRunning(false)
      setMiningStatus(MiningStatus.Stopped)
    }

    if (counter === 1) {
      setRunning(true)
      setMiningStatus(MiningStatus.Installing)
      setRunTime(0)
    }

    if (counter === 2) {
      setRunning(true)
      setMiningStatus(MiningStatus.Initializing)
      setProgress(0.1)
      setRunTime(30000)
    }

    if (counter === 3) {
      setRunning(true)
      setMiningStatus(MiningStatus.Initializing)
      setProgress(0.2)
      setRunTime(500000)
    }

    if (counter === 4) {
      setRunning(true)
      setMiningStatus(MiningStatus.Initializing)
      setProgress(0.3)
      setRunTime(1100000)
    }

    if (counter === 5) {
      setRunning(true)
      setMiningStatus(MiningStatus.Initializing)
      setProgress(0.4)
      setRunTime(1300000)
    }

    if (counter === 6) {
      setRunTime(1600000)
      setMiningStatus(MiningStatus.Running)
    }

    if (counter < 7) {
      setCounter(counter + 1)
    } else {
      setCounter(0)
    }
  }, 3000)

  return (
    <div
      style={{
        backgroundColor: '#092234',
        color: 'white',
        padding: '2rem',
      }}
    >
      <div style={{ marginBottom: 15 }}>Progress Simulation</div>
      <NewStartButton
        onClick={action('click')}
        progress={progress}
        status={miningStatus}
        runningTime={runTime}
        isRunning={isRunning}
      />
    </div>
  )
}

export const Chopping = () => (
  <NewStartButton
    onClick={action('click')}
    progress={0}
    status={MiningStatus.Running}
    runningTime={1400000}
    isRunning={true}
  />
)

export const NotCompatible = () => (
  <NewStartButton
    onClick={action('click')}
    onClickError={action('clicked when not compatible')}
    progress={0}
    isRunning={false}
  />
)

export const Large = () => (
  <NewStartButton
    onClick={action('click')}
    progress={0}
    status={MiningStatus.Stopped}
    runningTime={0}
    isRunning={false}
    isLarge={true}
  />
)

export const LargeNotCompatible = () => (
  <NewStartButton
    onClick={action('click')}
    onClickError={action('clicked when not compatible')}
    progress={0}
    isRunning={false}
    isLarge={true}
  />
)

export const LargeChopping = () => (
  <NewStartButton
    onClick={action('click')}
    progress={0}
    status={MiningStatus.Running}
    runningTime={1400000}
    isRunning={true}
    isLarge={true}
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
