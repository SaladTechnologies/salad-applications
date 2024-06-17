import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useState, type FC } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import { Checkbox } from '../../../components'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '200px',
    width: '210px',
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
  link: {
    color: theme.mediumGreen,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
  },
})

interface Machine {
  id: string
  color: string
  isChecked: boolean
}

type MachineOptions = Record<string, Machine>

const mockedMachines: Record<string, Machine> = {
  'machine-id-1': { id: 'machine-id-1', isChecked: false, color: '#277c87' },
  'machine-id-2': { id: 'machine-id-2', isChecked: false, color: '#ce7f25' },
  'machine-id-3': { id: 'machine-id-3', isChecked: false, color: '#13b58a' },
  'machine-id-4': { id: 'machine-id-4', isChecked: false, color: '#58580a' },
  'machine-id-5': { id: 'machine-id-5', isChecked: false, color: '#278729' },
  'machine-id-6': { id: 'machine-id-6', isChecked: false, color: '#093ac0' },
  'machine-id-7': { id: 'machine-id-7', isChecked: false, color: '#da6207' },
  'machine-id-8': { id: 'machine-id-8', isChecked: false, color: '#0aa445' },
  'machine-id-9': { id: 'machine-id-9', isChecked: false, color: '#0fc2aa' },
  'machine-id-10': { id: 'machine-id-10', isChecked: false, color: '#d71e9c' },
  'machine-id-11': { id: 'machine-id-11', isChecked: false, color: '#13a6ce' },
  'machine-id-12': { id: 'machine-id-12', isChecked: false, color: '#0eb00e' },
  'machine-id-13': { id: 'machine-id-13', isChecked: false, color: '#59de62' },
  'machine-id-14': { id: 'machine-id-14', isChecked: false, color: '#722787' },
  'machine-id-15': { id: 'machine-id-15', isChecked: false, color: '#3c2787' },
  'machine-id-16': { id: 'machine-id-16', isChecked: false, color: '#273587' },
  'machine-id-17': { id: 'machine-id-17', isChecked: false, color: '#278784' },
  'machine-id-18': { id: 'machine-id-18', isChecked: false, color: '#278729' },
  'machine-id-19': { id: 'machine-id-19', isChecked: false, color: '#c4490c' },
  'machine-id-20': { id: 'machine-id-20', isChecked: false, color: '#d355af' },
}

interface Props extends WithStyles<typeof styles> {}

const EarningMachineListRaw: FC<Props> = ({ classes }) => {
  const [machineOptions, setMachineOptions] = useState<MachineOptions>(mockedMachines)

  const handleMachineOptionClick = (machineId: string) => {
    setMachineOptions({
      ...machineOptions,
      [machineId]: {
        ...machineOptions[machineId],
        isChecked: !machineOptions[machineId]?.isChecked,
      },
    } as MachineOptions)
  }

  const machineOptionsList = Object.values(machineOptions)
  const totalMachinesAmount = machineOptionsList.length
  const checkedMachinesAmount = machineOptionsList.filter((machineOption) => machineOption.isChecked).length

  const title = `Machines (${checkedMachinesAmount}/${totalMachinesAmount})`

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text variant="baseM">{title}</Text>
        <a href="#">
          <Text className={classes.link} variant="baseS">
            Where to find the Machine ID?
          </Text>
        </a>
      </div>
      <Scrollbars>
        {machineOptionsList.map((machineOption) => (
          <div
            className={classes.option}
            onClick={() => handleMachineOptionClick(machineOption.id)}
            key={machineOption.id}
          >
            <Checkbox checked={machineOption.isChecked} checkedColor={machineOption.color} />
            <Text variant="baseM">{machineOption.id}</Text>
          </div>
        ))}
      </Scrollbars>
    </div>
  )
}

export const EarningMachineList = withStyles(styles)(EarningMachineListRaw)
