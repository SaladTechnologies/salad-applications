import type { FC } from 'react'
import { useEffect } from 'react'
import type { Profile } from '../../profile/models'

interface Props {
  currentProfile?: Profile
  trackUninstall: () => void
}

export const ExitSurvey: FC<Props> = ({ currentProfile, trackUninstall }) => {
  useEffect(() => {
    trackUninstall()
    if (currentProfile?.id) {
      window.location.replace(`https://p1atjy4hixj.typeform.com/saladexitsurvey#user_id=${currentProfile.id}`)
    } else {
      window.location.replace('https://p1atjy4hixj.typeform.com/saladexitsurvey')
    }
  }, [currentProfile?.id, trackUninstall])
  return null
}
