import { Button } from '@saladtechnologies/garden-components'
import { groupBy } from 'lodash'
import { useState } from 'react'
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
  const [showAdvancedSettings, toggleShowAdvancedSettings] = useState<boolean>(false)

  const splitArrays = groupBy(panels, 'isAdvanced')
  return (
    <>
      {splitArrays.false.map((panel, index) => (
        <div key={index} className={classes.container}>
          {panel.panel}
        </div>
      ))}
      {showAdvancedSettings && (
        <>
          {splitArrays.true.map((panel, index) => (
            <div key={index} className={classes.container}>
              {panel.panel}
            </div>
          ))}
        </>
      )}
      <Button
        variant="outlined"
        label={`${showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings`}
        onClick={() => toggleShowAdvancedSettings(!showAdvancedSettings)}
      />
    </>
  )
}

export const MachineSettingsList = withStyles(styles)(_MachineSettingsList)
