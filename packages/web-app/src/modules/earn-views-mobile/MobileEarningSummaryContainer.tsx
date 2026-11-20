import { useMemo, useState } from 'react'
import { useExternalState } from '../../app/external-state.ts'
import { connect } from '../../connect'
import { useXp } from '../../account/xp.ts'
import { useMachineEarningRates, useMachineEarningsHistory } from '../../earnings/machine-earnings.ts'
import type { RootStore } from '../../Store'
import type { BalanceState } from '../balance'
import { earningsPerMachineOf } from '../balance'
import type { EarningPerMachine } from '../balance/models'
import { getStore } from '../../Store'
import { MobileEarningSummary } from './components/MobileEarningSummary'

interface OwnProps {
  xp: number
  onPageMachineIdsChange: (machineIds: string[]) => void
  /** The balance, earnings and machines. */
  balance: BalanceState
  /** Each machine's earning windows for the chart range. */
  earningsPerMachine: EarningPerMachine
  /** Whether the account can use dedicated nodes. */
  hasDedicatedNodesAccess: boolean
}

const mapStoreToProps = (_store: RootStore, props: OwnProps): any => ({
  currentBalance: props.balance.currentBalance,
  earningsPerMachine: props.earningsPerMachine,
  lifetimeBalance: props.balance.lifetimeBalance,
  totalXp: props.xp,
  last24HrEarnings: props.balance.lastDayEarnings,
  last7DayEarnings: props.balance.lastWeekEarnings,
  last30DayEarnings: props.balance.lastMonthEarnings,
  machines: props.balance.machines,
  currentHourlyEarningRatesPerMachine: props.balance.currentHourlyEarningRatesPerMachine,
  daysShowing: props.balance.daysShowingEarnings,
  hasDedicatedNodesAccess: props.hasDedicatedNodesAccess,
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
  const xp = useXp()
  const balance = useExternalState(store.balance.state)
  const { loadedEarningsPerMachine, daysShowingEarnings } = balance
  // Charting every machine's history is costly, so it runs again only when the history or the chart range changes.
  const earningsPerMachine = useMemo(
    () => earningsPerMachineOf(loadedEarningsPerMachine, daysShowingEarnings),
    [loadedEarningsPerMachine, daysShowingEarnings],
  )
  return (
    <ConnectedMobileEarningSummary
      xp={xp}
      onPageMachineIdsChange={setPageMachineIds}
      balance={balance}
      earningsPerMachine={earningsPerMachine}
      hasDedicatedNodesAccess={useExternalState(store.dedicatedNodes.state).hasAccess}
    />
  )
}
