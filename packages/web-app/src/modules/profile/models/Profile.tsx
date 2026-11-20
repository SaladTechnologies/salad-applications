export type { Profile } from '../../../account/profile.ts'

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
