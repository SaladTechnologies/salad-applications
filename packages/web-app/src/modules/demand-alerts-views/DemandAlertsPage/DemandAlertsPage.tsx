import { Layout, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Head, mobileSize, Scrollbar } from '../../../components'
import { useHttp } from '../../../data/http-context.ts'
import type { DemandedHardwarePerformance, DemandedSubscription, DemandTier } from '../../../earnings/demand-monitor.ts'
import {
  reloadDemandAlertSubscriptions,
  subscribeToDemandAlert,
  unsubscribeFromDemandAlert,
  useDemandAlertsData,
} from '../../../earnings/demand-monitor.ts'
import type { SaladTheme } from '../../../SaladTheme'
import type { SubscribeToDemandAlertErrorType } from '../constants'
import {
  SubscribeToDemandAlertStatus,
  subscribeToDemandAlertStatusByErrorType,
  UnsubscribeFromDemandAlertStatus,
} from '../constants'
import { DemandAlertsList } from './DemandAlertsList'
import { DemandAlertsSetUp } from './DemandAlertsSetUp'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  page: {
    backgroundImage: 'linear-gradient(to right, #53A626 , #B2D530)',
    color: theme.darkBlue,
    fontFamily: theme.fontMallory,
    height: '100%',
  },
  demandAlertsPageDescription: {
    display: 'block',
    maxWidth: '650px',
  },
  demandContentContainer: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '650px',
  },
})

interface Props extends WithStyles<typeof styles> {
  demandedHardwarePerformanceList?: DemandedHardwarePerformance[]
  demandAlertSubscriptionList: readonly DemandedSubscription[]
  subscribeToDemandAlert: (gpuName: string, demandTier: DemandTier) => void
  subscribeToDemandAlertStatus: SubscribeToDemandAlertStatus
  setSubscribeToDemandAlertStatus: (status: SubscribeToDemandAlertStatus) => void
  unsubscribeFromDemandAlert: (subscriptionId: string) => void
  unsubscribeFromDemandAlertStatus: UnsubscribeFromDemandAlertStatus
  setUnsubscribeFromDemandAlertStatus: (status: UnsubscribeFromDemandAlertStatus) => void
}

const _DemandAlertsPage = ({
  classes,
  demandedHardwarePerformanceList,
  demandAlertSubscriptionList,
  subscribeToDemandAlert,
  subscribeToDemandAlertStatus,
  setSubscribeToDemandAlertStatus,
  unsubscribeFromDemandAlert,
  unsubscribeFromDemandAlertStatus,
  setUnsubscribeFromDemandAlertStatus,
}: Props) => {
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${mobileSize}px)` })

  const getPageContent = () => (
    <Layout background="transparent" title="Demand Alerts">
      <Head title="Demand Alerts" />
      <Text className={classes.demandAlertsPageDescription} variant="baseM">
        You can set up alerts to be notified when the demand level of a GPU reaches your sweet spot, even at a specific
        payout tier. When that scenario arrives we will notify you through email and an in-app message.
      </Text>
      <div className={classes.demandContentContainer}>
        <DemandAlertsSetUp
          demandedHardwarePerformanceList={demandedHardwarePerformanceList}
          setSubscribeToDemandAlertStatus={setSubscribeToDemandAlertStatus}
          subscribeToDemandAlert={subscribeToDemandAlert}
          subscribeToDemandAlertStatus={subscribeToDemandAlertStatus}
        />
        <DemandAlertsList
          demandAlertSubscriptionList={demandAlertSubscriptionList}
          setUnsubscribeFromDemandAlertStatus={setUnsubscribeFromDemandAlertStatus}
          unsubscribeFromDemandAlert={unsubscribeFromDemandAlert}
          unsubscribeFromDemandAlertStatus={unsubscribeFromDemandAlertStatus}
        />
      </div>
    </Layout>
  )

  return (
    <div className={classes.page}>
      {isTabletOrMobile ? getPageContent() : <Scrollbar>{getPageContent()}</Scrollbar>}
    </div>
  )
}

const DemandAlertsPage = withStyles(styles)(_DemandAlertsPage)

/** The status that a failed subscribe shows: the App API's problem type, or a plain failure. */
const subscribeStatusFromError = (error: unknown): SubscribeToDemandAlertStatus => {
  if (!error || typeof error !== 'object') return SubscribeToDemandAlertStatus.Failure

  // A problem response arrives as a SaladError, which keeps the response, as an axios error does.
  const response: unknown = Reflect.get(error, 'response')
  const data: unknown = typeof response === 'object' && response !== null ? Reflect.get(response, 'data') : undefined
  const type: unknown = typeof data === 'object' && data !== null ? Reflect.get(data, 'type') : undefined

  return (
    subscribeToDemandAlertStatusByErrorType[type as SubscribeToDemandAlertErrorType] ??
    SubscribeToDemandAlertStatus.Failure
  )
}

/**
 * The demand alerts page. It loads the GPUs to set an alert for and the account's alerts each time it opens, and holds
 * the subscribe and unsubscribe statuses, which the demand alerts store held. A subscribe or unsubscribe that succeeds
 * loads the alerts again, without waiting, then shows success, as the store did.
 */
export const DemandAlertsPageContainer = () => {
  const http = useHttp()
  const queryClient = useQueryClient()
  const { gpus, subscriptions } = useDemandAlertsData(http)
  const [subscribeStatus, setSubscribeStatus] = useState(SubscribeToDemandAlertStatus.Unknown)
  const [unsubscribeStatus, setUnsubscribeStatus] = useState(UnsubscribeFromDemandAlertStatus.Unknown)

  const subscribe = useCallback(
    async (gpuName: string, demandTier: DemandTier) => {
      try {
        setSubscribeStatus(SubscribeToDemandAlertStatus.Submitting)
        await subscribeToDemandAlert(http, gpuName, demandTier)
        void reloadDemandAlertSubscriptions(queryClient)
        setSubscribeStatus(SubscribeToDemandAlertStatus.Success)
      } catch (error) {
        setSubscribeStatus(subscribeStatusFromError(error))
        console.error('DemandAlertsPageContainer -> subscribeToDemandAlert: ', error)
      }
    },
    [http, queryClient],
  )

  const unsubscribe = useCallback(
    async (subscriptionId: string) => {
      try {
        setUnsubscribeStatus(UnsubscribeFromDemandAlertStatus.Submitting)
        await unsubscribeFromDemandAlert(http, subscriptionId)
        void reloadDemandAlertSubscriptions(queryClient)
        setUnsubscribeStatus(UnsubscribeFromDemandAlertStatus.Success)
      } catch (error) {
        setUnsubscribeStatus(UnsubscribeFromDemandAlertStatus.Failure)
        console.error('DemandAlertsPageContainer -> unsubscribeFromDemandAlert: ', error)
      }
    },
    [http, queryClient],
  )

  return (
    <DemandAlertsPage
      demandedHardwarePerformanceList={gpus}
      demandAlertSubscriptionList={subscriptions}
      subscribeToDemandAlert={subscribe}
      subscribeToDemandAlertStatus={subscribeStatus}
      setSubscribeToDemandAlertStatus={setSubscribeStatus}
      unsubscribeFromDemandAlert={unsubscribe}
      unsubscribeFromDemandAlertStatus={unsubscribeStatus}
      setUnsubscribeFromDemandAlertStatus={setUnsubscribeStatus}
    />
  )
}
