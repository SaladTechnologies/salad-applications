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
}

export interface AvatarForm {
  alt: string
  src: string
  id: string
  errorMessage?: string
  selected?: boolean
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
