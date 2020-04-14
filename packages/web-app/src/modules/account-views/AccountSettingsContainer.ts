import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SettingsPage, MenuItem } from '../../components'
import { ReferralSettingsContainer } from './referral-views'
import { VaultListContainer } from '../vault-views'
import { AccountContainer } from './account-views'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    { url: '/account/account', text: 'Account', component: AccountContainer },
    { url: '/account/referrals', text: 'Referrals', component: ReferralSettingsContainer },
    { url: '/account/reward-vault', text: 'Reward Vault', component: VaultListContainer },
  ]

  return {
    onCloseClicked: () => store.ui.hideModal(),
    onCloseKeyPress: () => store.ui.hideModal(),
    onListItemClick: (url: string) => store.routing.push(url),
    onSendBug: store.ui.openNewBug,
    menuItems: menuItems,
  }
}

export const AccountSettingsContainer = connect(mapStoreToProps, SettingsPage)
