import { SubscribeToDemandAlertStatus } from '../../DemandAlertsStore'

export const getCreateNewSubscriptionErrorText = (
  subscribeToDemandAlertStatus: SubscribeToDemandAlertStatus,
): string | null => {
  switch (subscribeToDemandAlertStatus) {
    case SubscribeToDemandAlertStatus.FAILURE:
      return 'Something went wrong. Please try again later'
    case SubscribeToDemandAlertStatus.ALREADY_EXISTS:
      return 'An alert with this GPU and Demand Scenario already exists.'
    case SubscribeToDemandAlertStatus.INVALID_GPU:
      return 'The GPU configuration provided is invalid.'
    default:
      return null
  }
}
