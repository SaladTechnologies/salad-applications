import { isEqual, sortBy } from 'lodash'
import { action, computed } from 'mobx'
import * as Storage from '../../Storage'
import type { RootStore } from '../../Store'
import type { OnboardingPageItemType, OnboardingPageName, OnboardingPagesType } from './models'
import { ONBOARDING_PAGE_NAMES } from './models'

const ONBOARDING_STORAGE_KEY = 'ONBOARDING_PAGES_COMPLETED'

export class OnboardingStore {
  private completedOnboardingPages: OnboardingPageName[] = []
  private redirectRoute: string = '/store'

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
  @computed
  private get availableOnboardingPages(): OnboardingPageItemType[] {
    const pages = [
      { NAME: ONBOARDING_PAGE_NAMES.WELCOME, PATH: '/onboarding/welcome', ORDER: 1, NATIVE: false },
      { NAME: ONBOARDING_PAGE_NAMES.REFERRAL, PATH: '/onboarding/referral', ORDER: 2, NATIVE: false },
    ]
    return pages
  }

  @computed
  public get hasCompletedAvailableOnboardingPages(): boolean {
    const availableOnboardingPagesNameArray = this.availableOnboardingPages.map((item) => item.NAME)
    const completedOnboarding = availableOnboardingPagesNameArray.some(
      (onboardingPagesName) =>
        this.onboardingPagesCompleted !== null &&
        JSON.parse(this.onboardingPagesCompleted).includes(onboardingPagesName),
    )
    return completedOnboarding
  }

  @computed
  public get onboardingPagesCompleted(): string | null {
    return Storage.getItem(ONBOARDING_STORAGE_KEY)
  }

  constructor(private readonly store: RootStore) {}

  @action
  public showOnboardingIfNeeded = () => {
    this.redirectRoute = this.store.routing.location.pathname + this.store.routing.location.search

    const currentReferral = this.store.referral.currentReferral?.code

    /**
     * Checks to see if users have gone through onboarding process.
     * If they have not but already have a referral code, we skip the
     * first two steps.
     */
    if (this.onboardingPagesCompleted == null) {
      currentReferral
        ? this.updateCompletedOnboardingPages([ONBOARDING_PAGE_NAMES.WELCOME, ONBOARDING_PAGE_NAMES.REFERRAL])
        : this.updateCompletedOnboardingPages([])
    } else {
      this.updateCompletedOnboardingPages(JSON.parse(this.onboardingPagesCompleted))
      if (currentReferral) {
        this.markOnboardingPageAsCompleted(ONBOARDING_PAGE_NAMES.WELCOME)
        this.markOnboardingPageAsCompleted(ONBOARDING_PAGE_NAMES.REFERRAL)
      }
    }

    if (this.hasOnboardingPagesToComplete(this.onboardingPagesCompleted)) {
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
   * In the case of wanting to reshow a page on startup like the
   * the Auto-Start page if certain conditions have not been met,
   * this function will do that.
   */
  @action
  public reshowOnboardingPagesIfNeeded = () => {}

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

  /**
   * Removes all account related onboarding pages from local storage.
   */
  @action
  public resetAccountOnboardingPagesCompleted = () => {
    if (this.onboardingPagesCompleted) {
      const completedOnboardingPages = JSON.parse(this.onboardingPagesCompleted)

      const welcomeIndex = completedOnboardingPages.indexOf(ONBOARDING_PAGE_NAMES.WELCOME)
      if (welcomeIndex > -1) {
        completedOnboardingPages.splice(welcomeIndex, 1)
      }

      const referralIndex = completedOnboardingPages.indexOf(ONBOARDING_PAGE_NAMES.REFERRAL)
      if (referralIndex > -1) {
        completedOnboardingPages.splice(referralIndex, 1)
      }

      this.updateCompletedOnboardingPages(completedOnboardingPages)
    }
  }

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
      const onboardingPagesCopy = [...this.availableOnboardingPages]

      const sortedOnboardingPages = onboardingPagesCopy.sort((a, b) => (a.ORDER > b.ORDER ? 1 : -1))
      const completedPagesCopy = [...this.completedOnboardingPages]
      let nextOnboardingPageOrder = currentOnboardingPageOrder + 1

      while (nextOnboardingPageOrder <= sortedOnboardingPages[sortedOnboardingPages.length - 1]!.ORDER) {
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
      this.store.analytics.trackOnboardingPageViewed(nextOnboardingPage.NAME, nextOnboardingPage.ORDER)
    } else {
      this.store.routing.push(this.redirectRoute)
    }
  }

  private getOnboardingPage = (name: OnboardingPageName): OnboardingPageItemType | undefined => {
    return this.availableOnboardingPages.find((page) => page.NAME === name)
  }

  private hasOnboardingPagesToComplete = (onboardingPagesCompletedInStorage: string | null): boolean => {
    const parsedStorageArray = onboardingPagesCompletedInStorage ? JSON.parse(onboardingPagesCompletedInStorage) : false
    if (parsedStorageArray) {
      const onboardingPagesCopy = this.availableOnboardingPages.map((page) => page.NAME)
      return !isEqual(sortBy(parsedStorageArray), sortBy(onboardingPagesCopy))
    } else {
      return true
    }
  }
}
