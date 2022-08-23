import { Ref } from 'react'

export enum ONBOARDING_PAGE_NAMES {
  WELCOME = 'Onboarding Welcome',
  REFERRAL = 'Onboarding Enter Referral Code',
  AFK_CONFIGURATION = 'Onboarding AFK Configuration',
  ANTIVIRUS_CONFIGURATION = 'Onboarding Antivirus Configuration',
  AUTO_START_CONFIGURATION = 'Onboarding Auto-Start Configuration',
  SLEEP_MODE_CONFIGURATION = 'Onboarding Sleep-Mode Configuration',
}

export type OnboardingPageName = ONBOARDING_PAGE_NAMES

export type OnboardingPageItemType = {
  NAME: ONBOARDING_PAGE_NAMES
  PATH: string
  ORDER: number
  NATIVE: boolean
}

export type OnboardingPagesType = OnboardingPageItemType[]

declare global {
  interface Window {
    // https://support.trustpilot.com/hc/en-us/articles/115011421468--Add-a-TrustBox-to-a-single-page-application
    Trustpilot?: {
      loadFromElement: (ref: Ref<any>, flag: boolean) => void
    }
  }
}
