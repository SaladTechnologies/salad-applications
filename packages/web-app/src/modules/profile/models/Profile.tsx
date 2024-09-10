export interface Profile {
  id: string
  username: string
  email: string
  extensions?: {
    minecraftUsername?: string
  }
  lastSeenApplicationVersion: string | undefined
  redemptionTfaEnabled: boolean
  saladBowlFirstLoginAt: string | undefined | null
  createdAt: string | undefined
  pendingTermsVersion: string | undefined
}

export interface Avatar {
  name: string
  description: string
  id: string
  imageUrl: string
}

export interface AvatarForm {
  alt: string
  src: string
  id: string
  errorMessage?: string
  selected?: boolean
}

export interface payPalResponse {
  email?: string
}

export enum ReferredStatus {
  CanEnter, //joined within the last week, could still enter a referral code
  Test, //Testing state
  NotReferred, //They didn't enter a code and don't have option anymore
  Referred,
}

export interface ProfileExtensions {
  minecraftUsername: string
}

export interface ExternalAuthProvider {
  email: string
  loginProvider: string
  providerDisplayName: string
}

export enum ExternalAuthProviderLoginAction {
  None = 'None',
  OneTimeCodeFlow = 'OneTimeCodeFlow',
  WithMessageConfirmation = 'WithMessageConfirmation',
  WithoutMessageConfirmation = 'WithoutMessageConfirmation',
}

export enum ExternalAuthProviderLoginStatus {
  Success = 'Success',
  Failed = 'Failed',
}
