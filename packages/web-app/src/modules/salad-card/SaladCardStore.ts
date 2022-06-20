import Axios, { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { SaladCard } from './models/SaladCard'

export class SaladCardStore {
  @observable
  public hasAcceptedTerms: boolean = false

  @observable
  public isCreateSaladCardLoading: boolean = false

  @observable
  public isCreateSaladCardSubmitSuccess: boolean = false

  @observable hasSaladCard: boolean = false

  @observable saladCard?: SaladCard

  @observable saladCardBalance?: number

  @observable isLockSaladCardLoading: boolean = false

  @observable lockSaladCardErrorMessage?: string

  @observable isReplaceSaladCardLoading: boolean = false

  @observable replaceSaladCardErrorMessage?: string

  @observable lastFourSaladCardDigits?: string

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
    this.isCreateSaladCardSubmitSuccess = false
    try {
      this.isCreateSaladCardLoading = true
      yield this.axios.post('/api/v2/salad-card/cards')
      this.isCreateSaladCardSubmitSuccess = true
      this.hasSaladCard = true
    } catch (e) {
      this.isCreateSaladCardSubmitSuccess = false
      if (Axios.isAxiosError(e)) {
        throw e
      }
    } finally {
      this.isCreateSaladCardLoading = false
    }
  })

  @action.bound
  public loadSaladCard = flow(function* (this: SaladCardStore) {
    try {
      const response = yield this.axios.get('/api/v2/salad-card/cards')
      const saladCardData: SaladCard[] = response.data

      if (saladCardData.length > 0) {
        this.hasSaladCard = true
        this.saladCard = saladCardData[0]
        this.lastFourSaladCardDigits = saladCardData[0].panMasked.slice(-4)
      } else {
        this.hasSaladCard = false
      }
    } catch (e) {
      this.hasSaladCard = false
    }
  })

  @action.bound
  public loadSaladCardBalance = flow(function* (this: SaladCardStore) {
    try {
      const response = yield this.axios.get(`/api/v2/salad-card/cards/${this.saladCard?.cardId}/balance`)

      this.saladCardBalance = response.data.currentBalance
    } catch (e) {
      this.hasSaladCard = false
    }
  })

  @action.bound
  public lockSaladCard = flow(function* (this: SaladCardStore) {
    try {
      this.isLockSaladCardLoading = true
      yield this.axios.put(`/api/v2/salad-card/cards/${this.saladCard?.cardId}/locked`, true, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (e) {
      if (Axios.isAxiosError(e)) {
        if (e.response && e.response.status === 404) {
          this.lockSaladCardErrorMessage = 'Card does not currently exist'
        } else if (e.response && e.response.status === 403) {
          this.lockSaladCardErrorMessage = `User's enrollment (and ability to re-enroll) has been terminated`
        } else {
          this.lockSaladCardErrorMessage = `An error occurred. Please try again.`
        }
      } else {
        this.lockSaladCardErrorMessage = `An error occurred. Please try again.`
      }
    } finally {
      this.isLockSaladCardLoading = false
    }
  })

  @action.bound
  public replaceSaladCard = flow(function* (this: SaladCardStore) {
    try {
      this.isReplaceSaladCardLoading = true
      const response = yield this.axios.post(`/api/v2/salad-card/cards/${this.saladCard?.cardId}/replace`)
      this.saladCard = response.data
      this.loadSaladCard()
    } catch (e) {
      if (Axios.isAxiosError(e)) {
        if (e.response && e.response.status === 403) {
          this.lockSaladCardErrorMessage = `User's enrollment (and ability to re-enroll) has been terminated`
        } else {
          this.lockSaladCardErrorMessage = `An error occurred. Please try again.`
        }
      } else {
        this.lockSaladCardErrorMessage = `An error occurred. Please try again.`
      }
    } finally {
      this.isReplaceSaladCardLoading = false
    }
  })

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}
}
