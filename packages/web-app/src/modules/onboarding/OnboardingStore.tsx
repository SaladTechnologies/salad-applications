import { isEqual, sortBy } from 'lodash'
import { action, flow, observable } from 'mobx'
import * as Storage from '../../Storage'
import { RootStore } from '../../Store'
import type { OnboardingPageItemType, WhitelistWindowsDefenderErrorType } from './models'
import { OnboardingPageName, OnboardingPagesType, ONBOARDING_PAGE_NAMES } from './models'

const ONBOARDING_STORAGE_KEY = 'ONBOARDING_PAGES_COMPLETED'

export class OnboardingStore {
  private completedOnboardingPages: OnboardingPageName[] | [] = []

  /**
   * This is the master array of onboarding pages a chef needs
   * to complete after creating an account. There are instances
   * where a chef will complete onboarding but certain pages may
   * not be available at the time because they are not on the
   * desktop app or the latest version. In those cases, those
   * pages will be skipped in the onboarding process but when
   * they are viewable, chefs will be taken to them on login.
   * Each item has a name, route, a completion order number,
   * and whether or not it is only available in the native app.
   */
  private onboardingPages =
    this.store.native.canDisableSleepMode && this.store.native.isNative
      ? [
          { NAME: ONBOARDING_PAGE_NAMES.WELCOME, PATH: '/onboarding/welcome', ORDER: 1, NATIVE: false },
          { NAME: ONBOARDING_PAGE_NAMES.REFERRAL, PATH: '/onboarding/referral', ORDER: 2, NATIVE: false },
          {
            NAME: ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION,
            PATH: '/onboarding/auto-start',
            ORDER: 3,
            NATIVE: true,
          },
          {
            NAME: ONBOARDING_PAGE_NAMES.SLEEP_MODE_CONFIGURATION,
            PATH: '/onboarding/sleep-mode',
            ORDER: 4,
            NATIVE: true,
          },
        ]
      : this.store.native.isNative
      ? [
          { NAME: ONBOARDING_PAGE_NAMES.WELCOME, PATH: '/onboarding/welcome', ORDER: 1, NATIVE: false },
          { NAME: ONBOARDING_PAGE_NAMES.REFERRAL, PATH: '/onboarding/referral', ORDER: 2, NATIVE: false },
          {
            NAME: ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION,
            PATH: '/onboarding/auto-start',
            ORDER: 3,
            NATIVE: true,
          },
        ]
      : [
          { NAME: ONBOARDING_PAGE_NAMES.WELCOME, PATH: '/onboarding/welcome', ORDER: 1, NATIVE: false },
          { NAME: ONBOARDING_PAGE_NAMES.REFERRAL, PATH: '/onboarding/referral', ORDER: 2, NATIVE: false },
        ]

  @observable
  public whitelistWindowsDefenderPending: boolean = false

  @observable
  public whitelistWindowsDefenderErrorType?: WhitelistWindowsDefenderErrorType

  public disableSleepModePending: boolean = false

  @observable
  public disableSleepModeErrorMessage?: string = undefined

  @observable
  public disableAutoStartPending: boolean = false

  @observable
  public disableAutoStartErrorMessage?: string = undefined

  constructor(private readonly store: RootStore) {}

  @action
  public showOnboardingIfNeeded = () => {
    const onboardingPagesCompleted = Storage.getItem(ONBOARDING_STORAGE_KEY)
    const currentReferral = this.store.referral.currentReferral?.code

    /**
     * Checks to see if users have gone through onboarding process.
     * If they have not but already have a referral code, we skip the
     * first two steps.
     */
    if (onboardingPagesCompleted == null) {
      currentReferral
        ? this.updateCompletedOnboardingPages([ONBOARDING_PAGE_NAMES.WELCOME, ONBOARDING_PAGE_NAMES.REFERRAL])
        : this.updateCompletedOnboardingPages([])
    } else {
      this.updateCompletedOnboardingPages(JSON.parse(onboardingPagesCompleted))
      if (currentReferral) {
        this.markOnboardingPageAsCompleted(ONBOARDING_PAGE_NAMES.WELCOME)
        this.markOnboardingPageAsCompleted(ONBOARDING_PAGE_NAMES.REFERRAL)
      }
    }

    /**
     * We renamed our AFK Configuration page to Auto Start so we are checking to
     * see if users have seen the AFK Config page and if they have, we are swapping
     * it out in our onboardingPagesCompleted array with our updated Auto Start page name
     * so users do not see this page again.
     * */
    if (onboardingPagesCompleted?.includes(ONBOARDING_PAGE_NAMES.AFK_CONFIGURATION)) {
      this.updateCompletedOnboardingPages(
        JSON.parse(
          onboardingPagesCompleted.replace(
            ONBOARDING_PAGE_NAMES.AFK_CONFIGURATION,
            ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION,
          ),
        ),
      )
    }

    if (this.hasOnboardingPagesToComplete(onboardingPagesCompleted)) {
      this.routeToNextUncompletedPage()
    }
  }

  /**
   * An action that determines what onboarding page to view next
   * based on order and completion.
   * @param currentOnboardingPageName The name of the current onboarding page completed.
   */
  @action
  public viewNextPage = (currentOnboardingPageName: OnboardingPageName) => {
    this.markOnboardingPageAsCompleted(currentOnboardingPageName)
    this.routeToNextUncompletedPage(currentOnboardingPageName)
  }

  /**
   * Updates onboarding store state and local storage with
   * an array of completed onboarding pages provided.
   * @param completedOnboardingPages An array of completed onboarding page names.
   */
  @action
  private updateCompletedOnboardingPages = (completedOnboardingPages: OnboardingPageName[] | []) => {
    this.completedOnboardingPages = completedOnboardingPages
    Storage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(completedOnboardingPages))
  }

  /**
   * Adds the current onboarding page name to the array of completed
   * onboarding pages.
   * @param onboardingPageName The name of the current onboarding page completed.
   */
  @action
  private markOnboardingPageAsCompleted = (onboardingPageName: OnboardingPageName) => {
    const completedOnboardingPagesCopy = [...this.completedOnboardingPages]
    if (completedOnboardingPagesCopy.indexOf(onboardingPageName) === -1) {
      completedOnboardingPagesCopy.push(onboardingPageName)
      this.updateCompletedOnboardingPages(completedOnboardingPagesCopy)
    }
  }

  @action.bound
  public disableSleepMode = flow(function* (this: OnboardingStore) {
    this.disableSleepModeErrorMessage = undefined
    this.disableSleepModePending = true
    try {
      yield this.store.native.disableSleepMode()
    } catch {
      this.disableSleepModeErrorMessage =
        'Something went wrong and we were unable to adjust your sleep mode settings. You can adjust these settings yourself in Windows Settings, or contact support for assistance.'
    } finally {
      this.disableSleepModePending = false
      this.viewNextPage(ONBOARDING_PAGE_NAMES.SLEEP_MODE_CONFIGURATION)
    }
  })

  @action
  public skipSleepMode = () => {
    this.viewNextPage(ONBOARDING_PAGE_NAMES.SLEEP_MODE_CONFIGURATION)
  }

  @action.bound
  public enableAutoStart = flow(function* (this: OnboardingStore) {
    this.disableAutoStartErrorMessage = undefined
    this.disableAutoStartPending = true
    try {
      yield this.store.autoStart.setAutoStart(true)
    } catch {
      this.disableAutoStartErrorMessage =
        'Something went wrong and we were unable to adjust your auto start settings. You can adjust these settings yourself in the Desktop App Settings, or contact support for assistance.'
    } finally {
      this.disableAutoStartPending = false
      this.viewNextPage(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
    }
  })

  @action
  public skipAutoStart = () => {
    this.viewNextPage(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
  }

  private findNextPageByOrder = (sortedOnboardingPages: OnboardingPagesType, nextPage: number) => {
    return sortedOnboardingPages.find((page) => page.ORDER === nextPage)
  }

  @action.bound
  public whitelistWindowsDefender = flow(function* (this: OnboardingStore) {
    this.whitelistWindowsDefenderErrorType = undefined
    this.whitelistWindowsDefenderPending = true
    try {
      yield this.store.native.whitelistWindowsDefender()
    } catch (error) {
      this.setWhitelistWindowsErrorType(error as WhitelistWindowsDefenderErrorType)
    } finally {
      this.whitelistWindowsDefenderPending = false
    }
  })

  @action
  public setWhitelistWindowsErrorType = (errorType: WhitelistWindowsDefenderErrorType) => {
    this.whitelistWindowsDefenderErrorType = errorType
  }

  /**
   * Routes to the next uncompleted onboarding page. If there are no more pages
   * to complete, we return the user to the home page.
   * @param currentOnboardingPageName The name of the current onboarding page completed.
   */
  private routeToNextUncompletedPage = (currentOnboardingPageName?: OnboardingPageName) => {
    const currentOnboardingPageOrder: number | undefined = currentOnboardingPageName
      ? this.getOnboardingPage(currentOnboardingPageName)?.ORDER
      : 0
    let nextOnboardingPage = undefined

    if (typeof currentOnboardingPageOrder === 'number') {
      const onboardingPagesCopy = [...this.onboardingPages]

      const sortedOnboardingPages = onboardingPagesCopy.sort((a, b) => (a.ORDER > b.ORDER ? 1 : -1))
      const completedPagesCopy = [...this.completedOnboardingPages]
      let nextOnboardingPageOrder = currentOnboardingPageOrder + 1

      while (nextOnboardingPageOrder <= sortedOnboardingPages[sortedOnboardingPages.length - 1].ORDER) {
        const nextPageByOrder = this.findNextPageByOrder(sortedOnboardingPages, nextOnboardingPageOrder)

        if (nextPageByOrder) {
          const breakCondition = !completedPagesCopy.includes(nextPageByOrder.NAME)
          if (breakCondition) {
            nextOnboardingPage = nextPageByOrder
            break
          }

          nextOnboardingPageOrder = nextOnboardingPageOrder + 1
        } else {
          break
        }
      }
    }

    if (nextOnboardingPage) {
      this.store.routing.push(nextOnboardingPage.PATH)
      this.store.analytics.trackAccountOnboardingPageViewed(nextOnboardingPage.NAME, nextOnboardingPage.ORDER)
    } else {
      this.store.routing.push('/')
    }
  }

  private getOnboardingPage = (name: OnboardingPageName): OnboardingPageItemType | undefined => {
    return this.onboardingPages.find((page) => page.NAME === name)
  }

  private hasOnboardingPagesToComplete = (onboardingPagesCompletedInStorage: string | null): boolean => {
    const parsedStorageArray = onboardingPagesCompletedInStorage ? JSON.parse(onboardingPagesCompletedInStorage) : false
    if (parsedStorageArray) {
      const onboardingPagesCopy = this.onboardingPages.map((page) => page.NAME)
      return !isEqual(sortBy(parsedStorageArray), sortBy(onboardingPagesCopy))
    } else {
      return true
    }
  }
}
