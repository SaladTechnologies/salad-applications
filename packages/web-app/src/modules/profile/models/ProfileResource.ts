export interface ProfileResource {
  id: string
  auth0Id: string
  created: string
  username: string
  email: string
  onboarding: {
    lastAcceptedTermsOfService: string | null | undefined
    lastSeenApplicationVersion: string | null | undefined
    lastAcceptedUsageTrackingVersion: string | null | undefined
  }
}
