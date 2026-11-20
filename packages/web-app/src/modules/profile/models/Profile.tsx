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

export interface ExternalAuthProvider {
  email: string
  loginProvider: string
  providerDisplayName: string
}

export enum ExternalAuthProviderLoginAction {
  OneTimeCodeFlow = 'OneTimeCodeFlow',
  WithMessageConfirmation = 'WithMessageConfirmation',
}

export enum ExternalAuthProviderLoginStatus {
  Success = 'Success',
  Failed = 'Failed',
}
