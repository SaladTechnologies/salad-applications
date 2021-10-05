import { Button, Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import { SettingsPanel } from '../components/SettingsPanel'

export interface SleepModeSettingProps {
  onDisableSleepMode: () => void
}

export const SleepModeSetting = ({ onDisableSleepMode }: SleepModeSettingProps) => {
  return (
    <SettingsPanel
      title="Sleep Mode"
      leftColumn={<LeftColumn />}
      rightColumn={<RightColumn onDisableSleepMode={onDisableSleepMode} />}
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
          By default, Salad stops Chopping when your PC goes to sleep. You can adjust this behavior in Windows Settings.
        </Text>
      </div>
      <Text variant="baseS">We recommend disabling sleep mode so you don't miss out on earnings.</Text>
    </>
  )
}

const LeftColumn = withStyles(leftColumnStyles)(_LeftColumn)

interface RightColumnProps {
  onDisableSleepMode: () => void
}

const RightColumn = ({ onDisableSleepMode }: RightColumnProps) => {
  return <Button label="Disable Sleep Mode" onClick={onDisableSleepMode} />
}
