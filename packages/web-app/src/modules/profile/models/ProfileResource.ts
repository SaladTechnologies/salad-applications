export interface ProfileResource {
  userId: string
  isReferred: string
  termsOfService: string
  trackUsageVersion: string
  tutorialComplete: number
  whatsNewVersion: string
  profileData: {
    email: string
    name: string
    nickname: string
  }
}
