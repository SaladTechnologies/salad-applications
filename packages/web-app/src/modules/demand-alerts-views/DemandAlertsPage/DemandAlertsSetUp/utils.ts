import { CreateNewSubscriptionStatus } from "../../DemandAlertsStore"

export const getCreateNewSubscriptionErrorText = (createNewSubscriptionStatus: CreateNewSubscriptionStatus): string | null => {
  switch (createNewSubscriptionStatus) {
    case CreateNewSubscriptionStatus.FAILURE:
      return 'Something went wrong. Please try again later'
    case CreateNewSubscriptionStatus.ALREADY_EXISTS:
      return 'An alert with this GPU and Demand Scenario already exists.'
    case CreateNewSubscriptionStatus.INVALID_GPU:
      return 'The GPU configuration provided is invalid.'
    default:
      return null
  }
}
