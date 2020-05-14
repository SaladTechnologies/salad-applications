import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { FooterBar } from './components/FooterBar'

const mapStoreToProps = (store: RootStore): any => ({
  onToggleMining: store.saladBowl.toggleRunning,
  status: store.saladBowl.status,
})

export const FooterBarContainer = connect(mapStoreToProps, FooterBar)
