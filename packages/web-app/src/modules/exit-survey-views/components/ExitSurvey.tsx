import type { FC } from 'react'
import { useEffect } from 'react'

interface Props {
  trackUninstall: () => void
}

export const ExitSurvey: FC<Props> = ({ trackUninstall }) => {
  useEffect(() => {
    trackUninstall()
    window.location.replace('https://salad.com/exit-survey-landing')
  }, [trackUninstall])
  return null
}
