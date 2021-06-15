export interface Profile {
  id: string
  username: string
  email: string
  extensions?: {
    minecraftUsername?: string
  }
  lastSeenApplicationVersion: string | undefined
}

export interface Avatar {
  name: string
  description: string
  id: string
  imageUrl: string
  selected?: boolean | null
  errorMessage?: string
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
