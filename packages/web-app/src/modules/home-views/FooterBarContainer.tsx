import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { FooterBar } from './components/FooterBar'

const mapStoreToProps = (store: RootStore): any => ({
  onToggleMining: store.saladBowl.toggleRunning,
  status: store.saladBowl.status,
  isEnabled: store.saladBowl.canRun,
  runningTime: store.saladBowl.runningTime,
})

export const FooterBarContainer = connect(mapStoreToProps, FooterBar)
