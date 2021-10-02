import { Button, Slider, Text } from '@saladtechnologies/garden-components'
import { useState } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SettingsPanel } from '../components/SettingsPanel'

export interface AutoStartSettingProps {
  autoStartTime: number
  onEnableAutoStart: (minutes: number) => void
}

export const AutoStartSetting = ({ autoStartTime, onEnableAutoStart }: AutoStartSettingProps) => {
  const [minutesSelected, setMinutesSelected] = useState<number>(autoStartTime || 0)
  return (
    <SettingsPanel
      title="Auto Start"
      leftColumn={<LeftColumn />}
      rightColumn={
        <RightColumn
          onChange={(minutes: number) => setMinutesSelected(minutes)}
          autoStartTime={minutesSelected}
          onEnableAutoStart={() => onEnableAutoStart(minutesSelected)}
        />
      }
    />
  )
}

const leftColumnStyles = () => ({
  textContainer: {
    marginBottom: 24,
  },
})

interface LeftColumnProps extends WithStyles<typeof leftColumnStyles> {}

const _LeftColumn = ({ classes }: LeftColumnProps) => {
  return (
    <>
      <div className={classes.textContainer}>
        <Text variant="baseL">
          Salad is designed to run best when you’re away from your machine (AFK). Auto Start will run Salad
          automatically when you’re AFK for a period of time.
        </Text>
      </div>
      <Text variant="baseS">We recommend enabling Auto Start.</Text>
    </>
  )
}

const LeftColumn = withStyles(leftColumnStyles)(_LeftColumn)

const rightColumnStyles = () => ({
  container: {
    marginBottom: 24,
  },
})

interface RightColumnProps extends WithStyles<typeof rightColumnStyles> {
  autoStartTime: number
  onEnableAutoStart: () => void
  onChange: (minutes: number) => void
}

const _RightColumn = ({ classes, autoStartTime, onEnableAutoStart, onChange }: RightColumnProps) => {
  return (
    <>
      <div className={classes.container}>
        <Button label="Enable Auto Start" onClick={onEnableAutoStart} />
      </div>
      <div className={classes.container}>
        <Slider minimum={0} maximum={60} value={autoStartTime} stepSize={10} onChange={onChange} />
      </div>
      <Text variant="baseS">Start after {autoStartTime} Minutes</Text>
    </>
  )
}

const RightColumn = withStyles(rightColumnStyles)(_RightColumn)
