import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { FooterBar } from './components/FooterBar'

const mapStoreToProps = (store: RootStore): any => ({
  status: store.saladBowl.status,
})

export const FooterBarContainer = connect(mapStoreToProps, FooterBar)
