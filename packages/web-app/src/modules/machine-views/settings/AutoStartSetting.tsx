import { Button, Slider, Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import { SettingsPanel } from '../components/SettingsPanel'

export interface AutoStartSettingProps {
  autoStartEnabled: boolean
  autoStartTime: number
  onToggleAutoStart: () => void
  onSetMinutesIdle: (minutes: number) => void
}

export const AutoStartSetting = ({
  autoStartEnabled,
  autoStartTime,
  onToggleAutoStart,
  onSetMinutesIdle,
}: AutoStartSettingProps) => {
  return (
    <SettingsPanel
      title="Auto Start"
      leftColumn={<LeftColumn />}
      rightColumn={
        <RightColumn
          onChange={(minutes: number) => onSetMinutesIdle(minutes)}
          autoStartEnabled={autoStartEnabled}
          autoStartTime={autoStartTime ? autoStartTime / 60 : 10}
          onToggleAutoStart={onToggleAutoStart}
        />
      }
    />
  )
}

const leftColumnStyles = {
  textContainer: {
    marginBottom: 24,
  },
}

interface LeftColumnProps extends WithStyles<typeof leftColumnStyles> {}

const _LeftColumn = ({ classes }: LeftColumnProps) => {
  return (
    <>
      <div className={classes.textContainer}>
        <Text variant="baseL">
          Salad performs best when you're away from the keyboard. The Auto Start setting gives Salad permission to
          detect inactivity and start earning Salad Balance automatically.
        </Text>
      </div>
      <Text variant="baseS">We recommend enabling Auto Start to maximize your earning opportunities.</Text>
    </>
  )
}

const LeftColumn = withStyles(leftColumnStyles)(_LeftColumn)

const rightColumnStyles = {
  container: {
    marginBottom: 24,
  },
}

interface RightColumnProps extends WithStyles<typeof rightColumnStyles> {
  autoStartEnabled: boolean
  autoStartTime: number
  onToggleAutoStart: () => void
  onChange: (minutes: number) => void
}

const _RightColumn = ({ classes, autoStartEnabled, autoStartTime, onToggleAutoStart, onChange }: RightColumnProps) => {
  return (
    <>
      <div className={classes.container}>
        <Button label={`${autoStartEnabled ? 'Disable' : 'Enable'} Auto Start`} onClick={onToggleAutoStart} />
      </div>
      <div className={classes.container}>
        <Slider
          minimum={10}
          maximum={60}
          value={autoStartTime}
          stepSize={10}
          onChange={(value: number) => {
            onChange(value * 60)
          }}
        />
      </div>
      <Text variant="baseS">Start after {autoStartTime} Minutes</Text>
    </>
  )
}

const RightColumn = withStyles(rightColumnStyles)(_RightColumn)
