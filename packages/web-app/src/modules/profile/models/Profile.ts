export interface Profile {
  id: string
  username: string
  email: string
  lastSeenApplicationVersion: string | undefined
}

export enum ReferredStatus {
  CanEnter, //joined within the last week, could still enter a referral code
  Test, //Testing state
  NotReferred, //They didn't enter a code and don't have option anymore
  Referred,
}
