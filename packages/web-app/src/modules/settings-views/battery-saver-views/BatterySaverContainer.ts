import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { BatterySaver } from './components'

const mapStoreToProps = (store: RootStore) => ({
  // onCloseClicked: () => store.ui.hideModal(),
})

export const BatterySaverContainer = connect(
  mapStoreToProps,
  BatterySaver,
)
