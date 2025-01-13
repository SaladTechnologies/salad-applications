import { SubscribeToDemandAlertStatus } from '../../DemandAlertsStore'

export const createNewSubscriptionErrorTexts: Partial<Record<SubscribeToDemandAlertStatus, string>> = {
  [SubscribeToDemandAlertStatus.Failure]: 'Something went wrong. Please try again later',
  [SubscribeToDemandAlertStatus.AlreadyExists]: 'An alert with this GPU and Demand Scenario already exists.',
  [SubscribeToDemandAlertStatus.InvalidGpu]: 'The GPU configuration provided is invalid.',
}
