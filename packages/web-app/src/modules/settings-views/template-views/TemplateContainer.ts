import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { Template } from './components'

const mapStoreToProps = (_store: RootStore): any => ({
  // onCloseClicked: () => store.ui.hideModal(),
})

export const TemplateContainer = connect(
  mapStoreToProps,
  Template,
)
