import type { RootStore } from '../../../../Store'
import { useStore } from '../../../../Store'
import type { ChartDaysShowing, EarningPerMachine } from '../../../balance/models'
import { EarningHistory } from './EarningHistory'

interface EarningHistoryContainerProps {
  earningsPerMachine: EarningPerMachine
  /** How many days the chart shows, which the page's container reads. */
  daysShowing: ChartDaysShowing
}

const mapStoreToProps = (store: RootStore, props: EarningHistoryContainerProps): any => {
  return {
    ...props,
    trackEarningHistoryFilterClicked: store.analytics.trackEarningHistoryFilterClicked,
    viewLast24Hours: store.balance.viewLast24Hours,
    viewLast30Days: store.balance.viewLast30Days,
    viewLast7Days: store.balance.viewLast7Days,
  }
}

/** The earnings chart, with the store's range actions. */
export const EarningHistoryContainer = (props: EarningHistoryContainerProps) => (
  <EarningHistory {...mapStoreToProps(useStore(), props)} />
)
