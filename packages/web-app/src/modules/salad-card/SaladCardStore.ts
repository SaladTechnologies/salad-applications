import Axios, { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { RootStore } from '../../Store'

export class SaladCardStore {
  @observable
  public hasAcceptedTerms: boolean = false

  @observable
  public isSubmitting: boolean = false

  @observable
  public isSubmitSuccess: boolean = false

  @observable hasSaladCard: boolean = false

  @action
  public toggleAcceptTerms = (accepted: boolean) => {
    this.hasAcceptedTerms = accepted
  }

  @action
  public routeToStore = () => {
    this.store.routing.push('/store')
  }

  @action.bound
  public createSaladCard = flow(function* (this: SaladCardStore) {
    this.isSubmitSuccess = false
    try {
      this.isSubmitting = true
      yield this.axios.post('/api/v2/salad-card/cards')
      this.isSubmitSuccess = true
      this.hasSaladCard = true
    } catch (e) {
      this.isSubmitSuccess = false
      if (Axios.isAxiosError(e)) {
        throw e
      }
    } finally {
      this.isSubmitting = false
    }
  })

  @action.bound
  public checkForSaladCard = flow(function* (this: SaladCardStore) {
    try {
      const response = yield this.axios.get('/api/v2/salad-card/cards')
      const saladCardData = response.data
      if (saladCardData.length > 0) {
        this.hasSaladCard = true
      } else if (saladCardData.length === 0) {
        this.hasSaladCard = false
      }
    } catch (e) {
      this.hasSaladCard = false
    }
  })

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}
}
