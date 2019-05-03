export interface ProfileResource {
  userId: string
  isReferred: string
  isNewUser: boolean
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
