import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SmartStart } from './components'

const mapStoreToProps = (store: RootStore) => ({
  // onCloseClicked: () => store.ui.hideModal(),
})

export const SmartStartContainer = connect(
  mapStoreToProps,
  SmartStart,
)
