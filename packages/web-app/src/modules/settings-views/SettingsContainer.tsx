import type { RootStore } from '../../Store'
import { SettingsPage } from '../../components'
import { config } from '../../config'
import { connect } from '../../connect'

const mapStoreToProps = (store: RootStore): any => {
  return {
    appBuild: config.appBuild,
    menuButtons: store.auth.isAuthenticated
      ? [
          {
            text: 'Log out',
            onClick: () => {
              store.analytics.trackButtonClicked('logout_button', 'Log Out', 'enabled')
              store.auth.logout()
            },
          },
        ]
      : [],
    isUserReferralsEnabled: store.referral.isUserReferralsEnabled,
    onClose: () => {
      store.analytics.trackSmartLink('/store', 'Back')
      store.ui.hideModal()
    },
  }
}

export const SettingsContainer = connect(mapStoreToProps, SettingsPage)
