import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EarningEventsList } from './components/EarningEventsList'

const mapStoreToProps = (store: RootStore): any => ({
  balanceEvents: store.balance.balanceEvents,
})

export const EarningEventsListContainer = connect(mapStoreToProps, EarningEventsList)
