import { connect } from '../../../../connect'
import type { RootStore } from '../../../../Store'
import type { EarningPerMachine } from '../../../balance/models'
import { EarningHistory } from './EarningHistory'

interface EarningHistoryContainerProps {
  earningsPerMachine: EarningPerMachine
}

const mapStoreToProps = (store: RootStore, props: EarningHistoryContainerProps): any => {
  return {
    ...props,
    daysShowing: store.balance.getDaysShowingEarnings,
    trackEarningHistoryFilterClicked: store.analytics.trackEarningHistoryFilterClicked,
    viewLast24Hours: store.balance.viewLast24Hours,
    viewLast30Days: store.balance.viewLast30Days,
    viewLast7Days: store.balance.viewLast7Days,
  }
}

export const EarningHistoryContainer = connect(mapStoreToProps, EarningHistory)
