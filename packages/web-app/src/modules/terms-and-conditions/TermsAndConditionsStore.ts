import { AxiosInstance, AxiosResponse } from 'axios'
import { action, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { Profile } from '../profile/models'

export class TermsAndConditionsStore {
  /** A value indicating whether a value is being submitted. */
  @observable
  public isSubmitting: boolean = false

  /** A value indicating whether the user accepted the terms and conditions. */
  @observable
  public acceptedTermsAndConditions: boolean = false

  constructor(
    private readonly axios: AxiosInstance,
    private readonly store: RootStore,
    ) {}

  @action.bound
  public submitTermsAndConditions = flow(function* (this: TermsAndConditionsStore) {
    try {
      this.isSubmitting = true
      const response: AxiosResponse<Profile> = yield this.axios.post(`/api/v1/profile/terms`,  this.store.profile.currentProfile?.pendingTermsVersion,  {
        headers: {
          'Content-Type': 'application/json',
        }})

      this.isSubmitting = false

      if (!response.data) {
        throw new Error("Accept Terms and Conditions failed")
      }

      this.store.profile.setProfileData(response.data)
      this.acceptedTermsAndConditions = false
    } catch (error) {
      this.isSubmitting = false
      console.error('Submit Terms and Conditions error: ', error)
    }
  })

  /** Toggles if the user accepted terms */
  @action
  public toggleAcceptTermsAndConditions = (accepted: boolean) => {
    this.acceptedTermsAndConditions = accepted
  }
}
