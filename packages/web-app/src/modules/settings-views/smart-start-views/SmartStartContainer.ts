import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { SmartStart } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  // onCloseClicked: () => store.ui.hideModal(),
})

export const SmartStartContainer = connect(
  mapStoreToProps,
  SmartStart,
)
