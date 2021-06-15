import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { BonusPage } from './components/BonusPage'

const mapStoreToProps = (store: RootStore): any => ({
  unclaimedBonuses: store.bonuses.unclaimedBonuses,
  claimBonus: store.bonuses.claimBonus,
})

export const BonusPageContainer = connect(mapStoreToProps, BonusPage)
