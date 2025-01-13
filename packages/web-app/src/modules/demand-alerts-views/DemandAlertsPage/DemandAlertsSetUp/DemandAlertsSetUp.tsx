import { Button, LoadingSpinner, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useEffect, useState, type FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ErrorText } from '../../../../components'
import type { DropdownOption } from '../../../../components/Dropdown'
import { DropdownLight } from '../../../../components/Dropdown'
import { DefaultTheme } from '../../../../SaladTheme'
import type { DemandedHardwarePerformance, DemandTier } from '../../../demand-monitor-views/DemandMonitorStore'
import type { DemandScenarioDropdownOption } from '../../constants'
import { demandScenario } from '../../constants'
import { SubscribeToDemandAlertStatus } from '../../DemandAlertsStore'
import { createNewSubscriptionErrorTexts } from './utils'

const styles: () => Record<string, CSS.Properties> = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  dropdownContainer: {
    display: 'flex',
    gap: '20px',
    flexDirection: 'row',
    '@media (max-width: 812px)': {
      flexDirection: 'column',
    },
  },
  dropdownContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  loadingSpinnerWrap: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {
  demandedHardwarePerformanceList?: DemandedHardwarePerformance[]
  fetchDemandedHardwarePerformanceList: () => void
  setSubscribeToDemandAlertStatus: (subscribeToDemandAlertStatus: SubscribeToDemandAlertStatus) => void
  subscribeToDemandAlert: (gpuName: string, demandTier: DemandTier) => void
  subscribeToDemandAlertStatus: SubscribeToDemandAlertStatus
}

const _DemandAlertsSetUp: FunctionComponent<Props> = ({
  classes,
  demandedHardwarePerformanceList,
  fetchDemandedHardwarePerformanceList,
  setSubscribeToDemandAlertStatus,
  subscribeToDemandAlert,
  subscribeToDemandAlertStatus,
}) => {
  const createNewSubscriptionErrorText = createNewSubscriptionErrorTexts[subscribeToDemandAlertStatus]

  const demandHardwareOptions = demandedHardwarePerformanceList?.map((demandHardware) => ({
    label: demandHardware.displayName,
    value: demandHardware.name,
  }))

  const initialSelectedDemandHardwareValue = demandHardwareOptions?.[0]?.value
  const initialSelectedDemandScenarioValue = demandScenario.high.value

  const [selectedDemandHardwareValue, setSelectedDemandHardwareValue] = useState<string | undefined>(
    initialSelectedDemandHardwareValue,
  )
  const [selectedDemandScenarioValue, setSelectedDemandScenarioValue] = useState<DemandTier | undefined>(
    initialSelectedDemandScenarioValue,
  )

  useEffect(() => {
    fetchDemandedHardwarePerformanceList()
    setSelectedDemandHardwareValue(initialSelectedDemandHardwareValue)
    return () => {
      setSubscribeToDemandAlertStatus(SubscribeToDemandAlertStatus.Unknown)
    }
  }, [initialSelectedDemandHardwareValue, fetchDemandedHardwarePerformanceList, setSubscribeToDemandAlertStatus])

  const handleDemandHardwareOptionChange = (demandHardwareOption: DropdownOption) => {
    setSelectedDemandHardwareValue(demandHardwareOption.value)
    setSubscribeToDemandAlertStatus(SubscribeToDemandAlertStatus.Unknown)
  }

  const handleDemandScenarioOptionChange = (demandScenarioOption: DemandScenarioDropdownOption) => {
    setSelectedDemandScenarioValue(demandScenarioOption.value)
    setSubscribeToDemandAlertStatus(SubscribeToDemandAlertStatus.Unknown)
  }

  const handleAddAlert = () => {
    if (selectedDemandHardwareValue && selectedDemandScenarioValue) {
      subscribeToDemandAlert(selectedDemandHardwareValue, selectedDemandScenarioValue)
    }
  }

  return (
    <div className={classes.container}>
      <Text variant="baseXL">Set up an alert</Text>
      <Text variant="baseS">Select the GPU and the demand scenario you wish to get notified for.</Text>
      {demandHardwareOptions ? (
        <>
          <div className={classes.dropdownContainer}>
            <div className={classes.dropdownContentContainer}>
              <Text variant="baseS">GPU</Text>
              <DropdownLight options={demandHardwareOptions} onChange={handleDemandHardwareOptionChange} />
            </div>
            <div className={classes.dropdownContentContainer}>
              <Text variant="baseS">Demand Scenario</Text>
              <DropdownLight options={Object.values(demandScenario)} onChange={handleDemandScenarioOptionChange} />
            </div>
          </div>
          <Button
            isLoading={subscribeToDemandAlertStatus === SubscribeToDemandAlertStatus.Submitting}
            onClick={handleAddAlert}
            label="Add Alert"
            outlineColor={DefaultTheme.darkBlue}
          />
          {createNewSubscriptionErrorText && <ErrorText>{createNewSubscriptionErrorText}</ErrorText>}
        </>
      ) : (
        <div className={classes.loadingSpinnerWrap}>
          <LoadingSpinner variant="light" size={100} />
        </div>
      )}
    </div>
  )
}

export const DemandAlertsSetUp = withStyles(styles)(_DemandAlertsSetUp)
