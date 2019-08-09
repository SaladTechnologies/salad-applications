import { ProfileResource } from './models/ProfileResource'
import { Profile } from './models/Profile'

export const profileFromResource = (pr: ProfileResource, skippedReferral?: boolean | undefined): Profile => {
  console.log('[[utils] profileFromResource] pr: ', pr)

  const profile = {
    id: pr.id,
    username: pr.username,
    email: pr.email,
    lastAcceptedTermsOfService: pr.onboarding.lastAcceptedTermsOfService,
    lastSeenApplicationVersion: pr.onboarding.lastSeenApplicationVersion,
    lastAcceptedUsageTrackingVersion: pr.onboarding.lastAcceptedUsageTrackingVersion,
  }

  return profile
}
