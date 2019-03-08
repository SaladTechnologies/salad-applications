import { ExperienceBar } from './components/ExperienceBar'
import { connect } from '../../connect'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
  currentXp: store.xp.currentXp,
  levels: store.xp.levels,
})

export const ExperienceBarContainer = connect(
  mapStoreToProps,
  ExperienceBar,
)
