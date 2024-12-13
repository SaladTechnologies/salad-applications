import { Button, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useEffect, useState, type FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ErrorText } from '../../../../components'
import type { SaladTheme } from '../../../../SaladTheme'
import { DefaultTheme } from '../../../../SaladTheme'
import type { DemandedSubscription } from '../../DemandAlertsStore'
import { UnsubscribeFromDemandAlertStatus } from '../../DemandAlertsStore'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  existingAlertsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '20px',
    border: `3px solid ${theme.lightGreen}`,
    borderRadius: '5px',
    marginTop: '20px',
  },
  alertContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  demandAlertSubscriptionList?: DemandedSubscription[]
  fetchDemandAlertSubscriptionList: () => void
  setUnsubscribeFromDemandAlertStatus: (unsubscribeFromDemandAlertStatus: UnsubscribeFromDemandAlertStatus) => void
  unsubscribeFromDemandAlert: (subscriptionId: string) => void
  unsubscribeFromDemandAlertStatus: UnsubscribeFromDemandAlertStatus
}

const _DemandAlertsList: FunctionComponent<Props> = ({
  classes,
  demandAlertSubscriptionList,
  fetchDemandAlertSubscriptionList,
  setUnsubscribeFromDemandAlertStatus,
  unsubscribeFromDemandAlert,
  unsubscribeFromDemandAlertStatus,
}) => {
  const [currentDemandedSubscriptionId, setCurrentDemandedSubscriptionId] = useState<string | null>(null)

  const demandScenario: Record<number, string> = {
    0: 'Low Demand',
    50: 'Moderate Demand',
    80: 'High Demand',
  }

  useEffect(() => {
    fetchDemandAlertSubscriptionList()
    return () => {
      setUnsubscribeFromDemandAlertStatus(UnsubscribeFromDemandAlertStatus.UNKNOWN)
    }
  }, [fetchDemandAlertSubscriptionList, setUnsubscribeFromDemandAlertStatus])

  const handleCancelSubscription = (demandedSubscriptionId: string) => {
    unsubscribeFromDemandAlert(demandedSubscriptionId)
    setCurrentDemandedSubscriptionId(demandedSubscriptionId)
  }

  return (
    demandAlertSubscriptionList &&
    demandAlertSubscriptionList?.length > 0 && (
      <div className={classes.container}>
        <Text variant="baseXL">Manage your existing alerts</Text>
        <Text variant="baseS">You will get alerted on the following scenarios:</Text>
        <div className={classes.existingAlertsContainer}>
          {demandAlertSubscriptionList.map((demandAlertSubscription) => {
            const isCurrentDemandedSubscriptionId = currentDemandedSubscriptionId === demandAlertSubscription.id

            const withCancelSubscriptionSubmitting =
              unsubscribeFromDemandAlertStatus === UnsubscribeFromDemandAlertStatus.SUBMITTING &&
              isCurrentDemandedSubscriptionId
            const withCancelSubscriptionFailure =
              unsubscribeFromDemandAlertStatus === UnsubscribeFromDemandAlertStatus.FAILURE &&
              isCurrentDemandedSubscriptionId
            return (
              <>
                <div className={classes.alertContainer}>
                  <Text variant="baseS">
                    {demandAlertSubscription.gpuDisplayName} @ {demandScenario[demandAlertSubscription.utilizationPct]}
                  </Text>
                  <Button
                    onClick={() => handleCancelSubscription(demandAlertSubscription.id)}
                    isLoading={withCancelSubscriptionSubmitting}
                    outlineColor={DefaultTheme.white}
                    label="Unsubscribe"
                    variant="primary"
                    size="small"
                  />
                </div>
                {withCancelSubscriptionFailure && <ErrorText>Something went wrong. Please try again later</ErrorText>}
              </>
            )
          })}
        </div>
      </div>
    )
  )
}

export const DemandAlertsList = withStyles(styles)(_DemandAlertsList)
