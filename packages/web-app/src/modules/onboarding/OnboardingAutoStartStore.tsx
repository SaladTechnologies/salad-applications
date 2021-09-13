import { action, computed, flow, observable } from 'mobx'
import * as Storage from '../../Storage'
import { RootStore } from '../../Store'
import { ONBOARDING_PAGE_NAMES } from './models'

export const DO_NOT_SHOW_AUTO_START_AGAIN = 'DO_NOT_SHOW_AUTO_START_AGAIN'

export class OnboardingAutoStartStore {
  @observable
  public enableAutoStartErrorMessage?: string = undefined

  @observable
  public enableAutoStartPending: boolean = false

  @observable
  public isDoNotShowAutoStartAgainEnabled: boolean = false

  @computed
  public get hasSeenAutoStartPage(): boolean {
    const hasSeenAutoStartPage =
      this.store.onboarding.onboardingPagesCompleted !== null &&
      this.store.onboarding.onboardingPagesCompleted.includes(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
    return hasSeenAutoStartPage
  }

  @computed
  public get shouldShowAutoStartPageAgain(): boolean {
    const shouldShowAutoStartPageAgain =
      this.store.native.isNative &&
      !this.store.autoStart.autoStart &&
      this.store.onboarding.onboardingPagesCompleted !== null &&
      this.store.onboarding.hasCompletedAvailableOnboardingPages &&
      !this.userHasSelectedDoNotShowAutoStartAgain &&
      this.store.onboarding.onboardingPagesCompleted.includes(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
    return shouldShowAutoStartPageAgain
  }

  @computed
  public get userHasSelectedDoNotShowAutoStartAgain(): boolean {
    return Storage.getItem(DO_NOT_SHOW_AUTO_START_AGAIN) === 'true'
  }

  constructor(private readonly store: RootStore) {}

  @action.bound
  public enableAutoStart = flow(function* (this: OnboardingAutoStartStore) {
    this.enableAutoStartErrorMessage = undefined
    this.enableAutoStartPending = true
    try {
      yield this.store.autoStart.setAutoStart(true)
    } catch {
      this.enableAutoStartErrorMessage =
        'Something went wrong and we were unable to adjust your auto start settings. You can adjust these settings yourself in the Desktop App Settings, or contact support for assistance.'
    } finally {
      this.enableAutoStartPending = false
    }
  })

  @action
  public onToggleDoNotShowAutoStartAgain = (checked: boolean) => {
    this.isDoNotShowAutoStartAgainEnabled = checked
  }

  @action
  public showAutoStartPageAgain = () => {
    this.store.routing.push('/onboarding/auto-start')
  }
}
