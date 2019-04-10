export interface Profile {
  id: string
  username: string
  email: string
  termsOfService?: string
  whatsNewVersion?: string
  referred?: boolean
  trackUsage?: boolean
  tutorialComplete: boolean
}
