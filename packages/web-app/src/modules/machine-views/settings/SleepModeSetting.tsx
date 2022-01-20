import { Button, Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import { SettingsPanel } from '../components/SettingsPanel'

export interface SleepModeSettingProps {
  onDisableSleepMode: () => void
  disableSleepModeErrorMessage?: string
  disableSleepModePending?: boolean
}

export const SleepModeSetting = ({
  disableSleepModeErrorMessage,
  disableSleepModePending,
  onDisableSleepMode,
}: SleepModeSettingProps) => {
  return (
    <SettingsPanel
      title="Sleep Mode"
      leftColumn={<LeftColumn />}
      rightColumn={
        <RightColumn
          onDisableSleepMode={onDisableSleepMode}
          disableSleepModeErrorMessage={disableSleepModeErrorMessage}
          disableSleepModePending={disableSleepModePending}
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
  disableSleepModeErrorMessage?: string
  disableSleepModePending?: boolean
}

const RightColumn = ({
  onDisableSleepMode,
  disableSleepModePending,
  disableSleepModeErrorMessage,
}: RightColumnProps) => {
  return (
    <Button
      label="Disable Sleep Mode"
      onClick={onDisableSleepMode}
      errorMessage={disableSleepModeErrorMessage}
      isLoading={disableSleepModePending}
    />
  )
}
