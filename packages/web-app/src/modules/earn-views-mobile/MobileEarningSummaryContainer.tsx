import { useState } from 'react'
import { connect } from '../../connect'
import { useMachineEarningRates, useMachineEarningsHistory } from '../../earnings/machine-earnings.ts'
import type { RootStore } from '../../Store'
import { getStore } from '../../Store'
import { MobileEarningSummary } from './components/MobileEarningSummary'

interface OwnProps {
  onPageMachineIdsChange: (machineIds: string[]) => void
}

const mapStoreToProps = (store: RootStore, props: OwnProps): any => ({
  currentBalance: store.balance.currentBalance,
  earningsPerMachine: store.balance.earningsPerMachine,
  lifetimeBalance: store.balance.lifetimeBalance,
  totalXp: store.xp.currentXp,
  last24HrEarnings: store.balance.lastDayEarnings,
  last7DayEarnings: store.balance.lastWeekEarnings,
  last30DayEarnings: store.balance.lastMonthEarnings,
  earningHistory: store.balance.earningsHistory,
  machines: store.balance.machines,
  currentHourlyEarningRatesPerMachine: store.balance.currentHourlyEarningRatesPerMachine,
  onPageMachineIdsChange: props.onPageMachineIdsChange,
})

const ConnectedMobileEarningSummary = connect(mapStoreToProps, MobileEarningSummary)

/**
 * The mobile earnings summary. While it is open it loads the machines' earning histories (at most once an hour) and the
 * current earning rates of the machines on the shown page of the machine list (every minute), into the store.
 */
export const MobileEarningSummaryContainer = () => {
  const store = getStore()
  const [pageMachineIds, setPageMachineIds] = useState<string[]>([])
  useMachineEarningsHistory(store.balance.loadEarningsPerMachine)
  useMachineEarningRates(pageMachineIds, store.balance.loadCurrentEarningRatesPerMachine)
  return <ConnectedMobileEarningSummary onPageMachineIdsChange={setPageMachineIds} />
}
