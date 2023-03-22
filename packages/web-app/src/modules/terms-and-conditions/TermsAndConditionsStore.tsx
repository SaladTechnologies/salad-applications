import type { AxiosInstance, AxiosResponse } from 'axios'
import { action, flow, observable } from 'mobx'
import type { ProfileStore } from '../profile'
import type { Profile } from '../profile/models'

export class TermsAndConditionsStore {
  /** A value indicating whether a value is being submitted. */
  @observable
  public isSubmitting: boolean = false

  /** A value indicating whether the user accepted the terms and conditions. */
  @observable
  public areTermsAndConditionsAccepted: boolean = false

  constructor(private readonly axios: AxiosInstance, private readonly profile: ProfileStore) {}

  @action.bound
  public submitTermsAndConditions = flow(function* (this: TermsAndConditionsStore) {
    try {
      this.isSubmitting = true
      const response: AxiosResponse<Profile> = yield this.axios.post(
        `/api/v1/profile/terms`,
        this.profile.currentProfile?.pendingTermsVersion,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      this.isSubmitting = false
      this.profile.setProfileData(response.data)
      this.areTermsAndConditionsAccepted = false
    } catch (error) {
      this.isSubmitting = false
      console.error('Submit Terms and Conditions error: ', error)
    }
  })

  /** Toggles if the user accepted terms */
  @action
  public toggleAcceptTermsAndConditions = (accepted: boolean) => {
    this.areTermsAndConditionsAccepted = accepted
  }
}
