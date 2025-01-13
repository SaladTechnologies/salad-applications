import { SubscribeToDemandAlertStatus } from '../../DemandAlertsStore'

export const createNewSubscriptionErrorTexts: Partial<Record<SubscribeToDemandAlertStatus, string>> = {
  [SubscribeToDemandAlertStatus.FAILURE]: 'Something went wrong. Please try again later',
  [SubscribeToDemandAlertStatus.ALREADY_EXISTS]: 'An alert with this GPU and Demand Scenario already exists.',
  [SubscribeToDemandAlertStatus.INVALID_GPU]: 'The GPU configuration provided is invalid.',
}
