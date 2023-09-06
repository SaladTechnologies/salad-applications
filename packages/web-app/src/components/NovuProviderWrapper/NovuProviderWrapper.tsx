import { NovuProvider } from '@novu/notification-center'
import { observer } from 'mobx-react'
import type { ReactElement } from 'react'
import { config } from '../../config'
import { getStore } from '../../Store'

interface NovuProviderWrapperProps {
  children: ReactElement
}

export const NovuProviderWrapper = observer(({ children }: NovuProviderWrapperProps): ReactElement | null => {
  const store = getStore()
  const { currentProfile, novuSignature } = store.profile
  if (currentProfile?.id) {
    return (
      <NovuProvider
        applicationIdentifier={config.novuAppId}
        subscriberId={currentProfile.id}
        initialFetchingStrategy={{ fetchNotifications: true, fetchUnseenCount: true }}
        subscriberHash={novuSignature}
      >
        {children}
      </NovuProvider>
    )
  }
  return children
})
