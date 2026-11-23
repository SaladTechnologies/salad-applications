import { useReferralCode } from '../../account/referrals.ts'
import type { RootStore } from '../../Store'
import { useStore } from '../../Store'
import { SettingsPage } from '../../components'
import { config } from '../../config'
import { useSession } from '../../data/session.ts'

const mapStoreToProps = (
  store: RootStore,
  props: { isUserReferralsEnabled: boolean; isAuthenticated: boolean },
): any => {
  return {
    appBuild: config.appBuild,
    menuButtons: props.isAuthenticated
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
    isUserReferralsEnabled: props.isUserReferralsEnabled,
    onClose: () => {
      store.analytics.trackSmartLink('/store', 'Back')
      store.routing.goBackOr('/store')
    },
  }
}

/** The settings page around the account pages. Its menu shows the referrals page only while referrals are enabled. */
export const SettingsContainer = () => (
  <SettingsPage
    {...mapStoreToProps(useStore(), {
      isUserReferralsEnabled: useReferralCode().enabled,
      isAuthenticated: useSession() === 'yes',
    })}
  />
)
