export enum ONBOARDING_PAGE_NAMES {
  WELCOME = 'Onboarding Welcome',
  REFERRAL = 'Onboarding Enter Referral Code',
}

export type OnboardingPageName = ONBOARDING_PAGE_NAMES

export type OnboardingPageItemType = {
  NAME: ONBOARDING_PAGE_NAMES
  PATH: string
  ORDER: number
  NATIVE: boolean
}

export type OnboardingPagesType = OnboardingPageItemType[]
