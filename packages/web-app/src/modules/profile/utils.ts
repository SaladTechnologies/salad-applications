import { ProfileResource } from './models/ProfileResource'
import { Profile, ReferredStatus } from './models/Profile'

export const profileFromResource = (r: ProfileResource, skippedReferral: boolean | undefined): Profile => ({
  id: String(r.userId),
  username: String(r.profileData.nickname),
  email: String(r.profileData.email),
  termsOfService: String(r.termsOfService),
  whatsNewVersion: String(r.whatsNewVersion),
  referred: getReferredStatus(r.isReferred, skippedReferral),
  trackUsageVersion: String(r.trackUsageVersion),
  tutorialComplete: r.tutorialComplete === 1,
})

const getReferredStatus = (isReferred: string, skippedReferral: boolean | undefined): ReferredStatus => {
  let statusCode = Number(isReferred)

  if (skippedReferral) return ReferredStatus.NotReferred

  //If the code is not a number, it is a valid code
  if (statusCode === NaN) {
    return ReferredStatus.Referred
  }

  switch (statusCode) {
    case 0:
      return ReferredStatus.CanEnter
    case 1:
      return ReferredStatus.Test
    default:
      return ReferredStatus.NotReferred
  }
}
