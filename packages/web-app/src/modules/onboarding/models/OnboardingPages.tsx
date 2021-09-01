export enum ONBOARDING_PAGE_NAMES {
  WELCOME = 'Onboarding Welcome',
  REFERRAL = 'Onboarding Enter Referral Code',
  AFK_CONFIGURATION = 'Onboarding AFK Configuration',
  AUTO_START_CONFIGURATION = 'Onboarding Auto-Start Configuration',
  SLEEP_MODE_CONFIGURATION = 'Onboarding Sleep-Mode Configuration',
}

export type OnboardingPageName = ONBOARDING_PAGE_NAMES

export type OnboardingPageItemType = { NAME: ONBOARDING_PAGE_NAMES; PATH: string; ORDER: number; NATIVE: boolean }

export type OnboardingPagesType = OnboardingPageItemType[]

/**
 * An array of all the available onboarding pages a chef
 * needs to complete after creating an account. Each page
 * has a name, route, a completion order number, and whether
 * or not it is only available in the native app.
 */
export const ONBOARDING_PAGES = [
  { NAME: ONBOARDING_PAGE_NAMES.WELCOME, PATH: '/onboarding/welcome', ORDER: 1, NATIVE: false },
  { NAME: ONBOARDING_PAGE_NAMES.REFERRAL, PATH: '/onboarding/referral', ORDER: 2, NATIVE: false },
  { NAME: ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION, PATH: '/onboarding/auto-start', ORDER: 3, NATIVE: true },
  { NAME: ONBOARDING_PAGE_NAMES.SLEEP_MODE_CONFIGURATION, PATH: '/onboarding/sleep-mode', ORDER: 4, NATIVE: true },
]
