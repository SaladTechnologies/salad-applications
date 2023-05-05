import { NovuProvider } from '@novu/notification-center'
import { observer } from 'mobx-react'
import type { ReactElement } from 'react'
import { config } from '../../config'
import { getStore } from '../../Store'

interface Props {
  children: ReactElement
}

export const NovuProviderWrapper = observer(({ children }: Props): ReactElement | null => {
  const store = getStore()
  const { currentProfile } = store.profile
  if (currentProfile?.id) {
    return (
      <NovuProvider
        applicationIdentifier={config.novuAppId}
        subscriberId={currentProfile?.id}
        initialFetchingStrategy={{ fetchNotifications: true }}
      >
        {children}
      </NovuProvider>
    )
  }
  return children
})
