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
  public isDoNotShowAutoStartAgainChecked: boolean = false

  @computed
  public get haveSeenAutoStartPage(): boolean {
    const haveSeenAutoStartPage =
      this.store.onboarding.onboardingPagesCompleted !== null &&
      this.store.onboarding.onboardingPagesCompleted.includes(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
    return haveSeenAutoStartPage
  }

  @computed
  public get shouldShowAutoStartPageAgain(): boolean {
    const shouldShowAutoStartPageAgain =
      this.store.native.isNative &&
      !this.store.autoStart.autoStart &&
      this.store.onboarding.onboardingPagesCompleted !== null &&
      this.store.onboarding.hasCompletedOnboarding &&
      !this.userHasSelectedDoNotShowAutoStartAgain &&
      this.store.onboarding.onboardingPagesCompleted.includes(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
    return shouldShowAutoStartPageAgain
  }

  @computed
  public get userHasSelectedDoNotShowAutoStartAgain(): boolean {
    if (Storage.getItem(DO_NOT_SHOW_AUTO_START_AGAIN)) {
      return true
    } else {
      return false
    }
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
      this.store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
    }
  })

  @action
  public skipAutoStart = () => {
    this.store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
  }

  @action
  public onToggleDoNotShowAutoStartAgain = (checked: boolean) => {
    this.isDoNotShowAutoStartAgainChecked = checked
  }

  @action
  public showAutoStartPageAgain = () => {
    this.store.routing.push('/onboarding/auto-start')
  }
}
