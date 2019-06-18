import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { ComingSoon } from './components'

const mapStoreToProps = (store: RootStore) => ({
  // onCloseClicked: () => store.ui.hideModal(),
})

export const ComingSoonContainer = connect(
  mapStoreToProps,
  ComingSoon,
)
