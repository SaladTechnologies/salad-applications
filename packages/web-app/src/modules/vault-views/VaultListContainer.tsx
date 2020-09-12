import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { VaultList } from './components/VaultList'

const mapStoreToProps = (store: RootStore): any => ({
  redemptions: store.vault.redemptions,
  startRefresh: store.vault.startRefresh,
  stopRefresh: store.vault.stopRefresh,
})

export const VaultListContainer = connect(mapStoreToProps, VaultList)
