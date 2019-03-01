import { ExperienceBar } from './components/ExperienceBar'
import { connect, MapStoreToProps } from '../../connect'

const mapStoreToProps: MapStoreToProps = store => ({
  currentXp: store.xp.currentXp,
  levels: store.xp.levels,
})

export const ExperienceBarContainer = connect(
  mapStoreToProps,
  ExperienceBar,
)
