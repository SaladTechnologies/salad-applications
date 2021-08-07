export enum ONBOARDING_PAGE_NAMES {
  WELCOME = 'Onboarding Welcome',
  REFERRAL = 'Onboarding Enter Referral Code',
  AFK_CONFIGURATION = 'Onboarding AFK Configuration',
}

export type OnboardingPageName = ONBOARDING_PAGE_NAMES

export type OnboardingPageItemType = { NAME: ONBOARDING_PAGE_NAMES; PATH: string; ORDER: number; NATIVE: boolean }

export type OnboardingPagesType = OnboardingPageItemType[]

/**
 * An array of onboarding pages a chef needs to complete
 * after creating an account. Each page has a name, route,
 * and a completion order number.
 */
export const ONBOARDING_PAGES = [
  { NAME: ONBOARDING_PAGE_NAMES.WELCOME, PATH: '/onboarding/welcome', ORDER: 1, NATIVE: false },
  { NAME: ONBOARDING_PAGE_NAMES.REFERRAL, PATH: '/onboarding/referral', ORDER: 2, NATIVE: false },
  { NAME: ONBOARDING_PAGE_NAMES.AFK_CONFIGURATION, PATH: '/onboarding/afk', ORDER: 3, NATIVE: true },
]
