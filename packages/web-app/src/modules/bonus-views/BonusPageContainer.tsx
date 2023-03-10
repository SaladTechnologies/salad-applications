import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { BonusPage } from './components/BonusPage'

const mapStoreToProps = (store: RootStore): any => ({
  unclaimedBonuses: store.bonuses.unclaimedBonuses,
  pendingBonuses: store.bonuses.pendingBonuses,
  claimBonus: store.bonuses.claimBonus,
})

export const BonusPageContainer = connect(mapStoreToProps, BonusPage)
