import { connect } from '../../connect'
import { SmartStart } from './components/SmartStart'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
    onCloseClicked: () => store.ui.hideModal(),
})

export const SmartStartContainer = connect(
    mapStoreToProps,
    SmartStart,
)
