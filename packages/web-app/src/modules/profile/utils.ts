import { ProfileResource } from './models/ProfileResource'
import { Profile } from './models/Profile'

export const profileFromResource = (pr: ProfileResource, skippedReferral?: boolean | undefined): Profile => {
  return {
    id: pr.id,
    username: pr.username,
    email: pr.email,
    lastAcceptedTermsOfService: pr.lastAcceptedTermsOfService,
    lastSeenApplicationVersion: pr.lastSeenApplicationVersion,
    lastAcceptedUsageTrackingVersion: pr.lastAcceptedUsageTrackingVersion,
  }
}
