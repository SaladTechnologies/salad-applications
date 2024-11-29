import { Button, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { DefaultTheme } from '../../../../SaladTheme'
import { Dropdown } from '../../../../components/Dropdown'
import { customDropdownStyles, demandScenarios, mockedGpuNames } from '../../utils'

const styles: () => Record<string, CSS.Properties> = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  dropdownContainer: {
    display: 'flex',
    gap: '20px',
  },
  dropdownContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
})

interface Props extends WithStyles<typeof styles> {}

const _DemandAlertsSetUp: FunctionComponent<Props> = ({ classes }) => {
  return (
    <div className={classes.container}>
      <Text variant="baseXL">Set up an alert</Text>
      <Text variant="baseS">Select the GPU and the demand scenario you wish to get notified for.</Text>
      <div className={classes.dropdownContainer}>
        <div className={classes.dropdownContentContainer}>
          <Text variant="baseS">GPU</Text>
          <Dropdown customStyles={customDropdownStyles} options={mockedGpuNames} />
        </div>
        <div className={classes.dropdownContentContainer}>
          <Text variant="baseS">Demand Scenario</Text>
          <Dropdown customStyles={customDropdownStyles} options={demandScenarios} />
        </div>
      </div>
      <Button onClick={() => {}} label="Add Alert" outlineColor={DefaultTheme.darkBlue} />
    </div>
  )
}

export const DemandAlertsSetUp = withStyles(styles)(_DemandAlertsSetUp)
