import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { VaultList } from './components/VaultList'

const mapStoreToProps = (store: RootStore): any => ({
  redemptions: store.vault.redemptions,
})

export const VaultListContainer = connect(mapStoreToProps, VaultList)
