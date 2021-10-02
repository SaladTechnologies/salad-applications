import { Button, Checkbox, Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import { SettingsPanel } from '../components/SettingsPanel'

export interface CloseToTraySettingProps {
  closeToTray: boolean
  notify: boolean
  onToggleCloseToTray: () => void
  onToggleNotification: () => void
}

export const CloseToTraySetting = ({
  closeToTray,
  notify,
  onToggleCloseToTray,
  onToggleNotification,
}: CloseToTraySettingProps) => {
  return (
    <SettingsPanel
      title="Close to Tray"
      leftColumn={<LeftColumn />}
      rightColumn={
        <RightColumn
          closeToTray={closeToTray}
          notify={notify}
          onToggleCloseToTray={onToggleCloseToTray}
          onToggleNotification={onToggleNotification}
        />
      }
    />
  )
}

const LeftColumn = () => {
  return (
    <Text variant="baseL">
      Salad will hide in the tray and continue to run in the background when you select the Close (X) button. Use the
      tray icon to quit Salad.
    </Text>
  )
}

const rightColumnStyles = () => ({
  buttonContainer: {
    marginBottom: 24,
  },
})

interface RightColumnProps extends WithStyles<typeof rightColumnStyles> {
  closeToTray: boolean
  notify: boolean
  onToggleCloseToTray: () => void
  onToggleNotification: () => void
}

const _RightColumn = ({
  classes,
  closeToTray,
  notify,
  onToggleCloseToTray,
  onToggleNotification,
}: RightColumnProps) => {
  return (
    <>
      <div className={classes.buttonContainer}>
        <Button label={`${closeToTray ? 'Disable' : 'Enable'} Close to Tray`} onClick={onToggleCloseToTray} />
      </div>
      <Checkbox label="Notify me when closing to tray" checked={notify} onChange={onToggleNotification} />
    </>
  )
}

const RightColumn = withStyles(rightColumnStyles)(_RightColumn)
