import withStyles, { WithStyles } from 'react-jss'
import { DesktopSettingPanels } from '../settings/models/DesktopSettingsPanel'

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
})

interface MachineSettingsListProps extends WithStyles<typeof styles> {
  panels: DesktopSettingPanels
}

const _MachineSettingsList = ({ classes, panels }: MachineSettingsListProps) => {
  return (
    <>
      {panels.map((panel, index) => (
        <div key={index} className={classes.container}>
          {panel.panel}
        </div>
      ))}
    </>
  )
}

export const MachineSettingsList = withStyles(styles)(_MachineSettingsList)
