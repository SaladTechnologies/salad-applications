import { SettingsPage } from '../../components'
import { config } from '../../config'
import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { AccountContainer } from '../account-views/account-views'
import { ReferralSettingsContainer } from '../account-views/referral-views'
import { BonusPageContainer } from '../bonus-views'

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
    menuItems: [
      { url: '/account/summary', text: 'Account', component: AccountContainer },
      { url: '/account/referrals', text: 'Referrals', component: ReferralSettingsContainer },
      { url: '/account/bonuses', text: 'Bonuses', component: BonusPageContainer },
    ],
    onClose: () => {
      store.analytics.trackSmartLink('/store', 'Back')
      store.ui.hideModal()
    },
  }
}

export const SettingsContainer = connect(mapStoreToProps, SettingsPage)
