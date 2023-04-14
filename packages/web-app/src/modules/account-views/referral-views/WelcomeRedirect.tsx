import type { FC } from 'react'
import { useEffect } from 'react'
import type { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router'
import { saveUTMTagsToCookies } from '../../../utmTags'

export const WelcomeRedirect: FC<RouteComponentProps> = ({ location }) => {
  useEffect(() => {
    if (!location.search) {
      return
    }

    saveUTMTagsToCookies(location.search, document.cookie)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Redirect exact from="/welcome" to="/onboarding/welcome" />
}
