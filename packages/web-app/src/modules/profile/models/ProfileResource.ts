export interface ProfileResource {
  id: string
  created: string
  username: string
  email: string
  lastAcceptedTermsOfService: string | undefined
  lastSeenApplicationVersion: string | undefined
  lastAcceptedUsageTrackingVersion: string | undefined
}
