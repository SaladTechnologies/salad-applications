import { isEqual, sortBy } from 'lodash'
import { action, flow, observable } from 'mobx'
import * as Storage from '../../Storage'
import { RootStore } from '../../Store'
import type { OnboardingPageItemType } from './models'
import { OnboardingPageName, OnboardingPagesType, ONBOARDING_PAGES, ONBOARDING_PAGE_NAMES } from './models'

const ONBOARDING_STORAGE_KEY = 'ONBOARDING_PAGES_COMPLETED'

export class OnboardingStore {
  private completedOnboardingPages: OnboardingPageName[] | [] = []

  public disableSleepModePending: boolean = false

  @observable
  public disableSleepModeError: boolean = false

  constructor(private readonly store: RootStore) {}

  @action
  public showOnboardingIfNeeded = () => {
    const onboardingPagesCompleted = Storage.getItem(ONBOARDING_STORAGE_KEY)
    const currentReferral = this.store.referral.currentReferral?.code

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
    this.disableSleepModeError = false
    this.disableSleepModePending = true
    try {
      yield this.store.native.disableSleepMode()
    } catch {
      this.disableSleepModeError = true
    } finally {
      this.disableSleepModePending = false
    }
  })

  private findNextPageByOrder = (sortedOnboardingPages: OnboardingPagesType, nextPage: number) => {
    return sortedOnboardingPages.find((page) => page.ORDER === nextPage)
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
      const filteredOnboardingPagesCopy = this.getFilteredOnboardingPages()

      const sortedOnboardingPages = filteredOnboardingPagesCopy.sort((a, b) => (a.ORDER > b.ORDER ? 1 : -1))
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
      if (nextOnboardingPage.NAME === ONBOARDING_PAGE_NAMES.ANTIVIRUS_CONFIGURATION) {
        const antivirusConfigurationPageType = this.store.onboardingAntivirus.pageType
        this.store.analytics.trackOnboardingPageViewed(
          nextOnboardingPage.NAME,
          nextOnboardingPage.ORDER,
          antivirusConfigurationPageType,
        )
      } else {
        this.store.analytics.trackOnboardingPageViewed(nextOnboardingPage.NAME, nextOnboardingPage.ORDER)
      }
    } else {
      this.store.routing.push('/')
    }
  }

  private getOnboardingPage = (name: OnboardingPageName): OnboardingPageItemType | undefined => {
    return ONBOARDING_PAGES.find((page) => page.NAME === name)
  }

  private hasOnboardingPagesToComplete = (onboardingPagesCompletedInStorage: string | null): boolean => {
    const parsedStorageArray = onboardingPagesCompletedInStorage ? JSON.parse(onboardingPagesCompletedInStorage) : false
    if (parsedStorageArray) {
      const availableOnboardingPageNamesArray = this.getFilteredOnboardingPages().map((page) => page.NAME)
      return !isEqual(sortBy(parsedStorageArray), sortBy(availableOnboardingPageNamesArray))
    } else {
      return true
    }
  }

  /**
   * Returns available onboarding pages a user must go through based
   * on whether they are in the web or native app.
   */
  private getFilteredOnboardingPages = (): OnboardingPageItemType[] => {
    const onboardingPagesCopy = [...ONBOARDING_PAGES]
    const isNative = this.store.native.isNative
    const isWindows = this.store.native.platform === 'win32'

    const availableOnboardingPageNamesArray =
      isNative && isWindows
        ? onboardingPagesCopy
        : isNative && !isWindows
        ? onboardingPagesCopy.filter((page) => page.WINDOWS_ONLY === false)
        : onboardingPagesCopy.filter((page) => page.NATIVE === false)

    return availableOnboardingPageNamesArray
  }
}
