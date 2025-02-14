import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { type FC } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../../SaladTheme'
import { Checkbox } from '../../../../../components'
import { earningsChartColors } from '../../../pages/constants'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100%',
    minWidth: '260px',
    overflow: 'hidden',
    color: theme.lightGreen,
  },
  header: {
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
  },
})

interface MachineOption {
  id: string
  color: string
  isChecked: boolean
}

export type MachineOptions = Record<string, MachineOption>

interface Props extends WithStyles<typeof styles> {
  isAggregateView: boolean
  machineOptions: MachineOptions
  onSelectedMachineChange: (machineId: string) => void
}

const EarningMachineListRaw: FC<Props> = ({ classes, machineOptions, isAggregateView, onSelectedMachineChange }) => {
  const machineOptionsList = Object.values(machineOptions)
  const totalMachinesAmount = machineOptionsList.length
  const checkedMachinesAmount = machineOptionsList.filter((machineOption) => machineOption.isChecked).length

  const title = `Machines (${checkedMachinesAmount}/${totalMachinesAmount})`

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text variant="baseM">{title}</Text>
      </div>
      <Scrollbars>
        {machineOptionsList.map((machineOption, index) => (
          <div
            className={classes.option}
            onClick={() => onSelectedMachineChange(machineOption.id)}
            key={machineOption.id}
          >
            <Checkbox checked={machineOption.isChecked} checkedColor={earningsChartColors[index]} />
            <Text variant="baseM">{isAggregateView ? machineOption.id : machineOption.id.substring(0, 8)}</Text>
          </div>
        ))}
      </Scrollbars>
    </div>
  )
}

export const EarningMachineList = withStyles(styles)(EarningMachineListRaw)
