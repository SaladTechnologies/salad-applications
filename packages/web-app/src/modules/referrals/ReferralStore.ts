import { AxiosInstance } from 'axios'
import { action, observable } from 'mobx'

export class ReferralStore {
  @observable
  public submittingReferral = false
  constructor(private readonly axios: AxiosInstance) {}

  @action
  submitReferralCode = async (code: string) => {
    if (this.submittingReferral) return
    this.submittingReferral = true

    await this.sleep(2000)
    await this.axios.post('')

    this.submittingReferral = false
  }

  sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
