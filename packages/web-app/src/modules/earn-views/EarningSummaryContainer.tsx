import { useMemo, useState } from 'react'
import { useExternalState } from '../../app/external-state.ts'
import { connect } from '../../connect'
import type { BonusEarningRate } from '../../account/bonuses.ts'
import { useEarningRateBonus } from '../../account/bonuses.ts'
import { useXp } from '../../account/xp.ts'
import { useMachineEarningRates, useMachineEarningsHistory } from '../../earnings/machine-earnings.ts'
import { useVaultRefresh } from '../../rewards/vault.ts'
import { useNavigation } from '../../routing/navigation-context.ts'
import type { RootStore } from '../../Store'
import type { BalanceState } from '../balance'
import { earningsPerMachineOf } from '../balance'
import type { EarningPerMachine } from '../balance/models'
import type { VaultState } from '../vault'
import { getStore } from '../../Store'
import { EarningSummaryPage } from './pages/EarningSummaryPage'
import { getNumberWithCommas } from './utils'

interface OwnProps {
  xp: number
  bonusEarningRate: BonusEarningRate | undefined
  onNavigateToVault: () => void
  onPageMachineIdsChange: (machineIds: string[]) => void
  /** The balance, earnings and machines. */
  balance: BalanceState
  /** Each machine's earning windows for the chart range. */
  earningsPerMachine: EarningPerMachine
  /** Whether the account can use dedicated nodes. */
  hasDedicatedNodesAccess: boolean
  /** The vault and its latest completed rewards. */
  vault: VaultState
}

const mapStoreToProps = (store: RootStore, props: OwnProps): any => {
  const trackAndNavigateToRewardVaultPage = () => {
    store.analytics.trackEarnPageVaultButtonClicked()
    props.onNavigateToVault()
  }

  return {
    currentBalance: props.balance.currentBalance,
    earningsPerMachine: props.earningsPerMachine,
    lifetimeBalance: props.balance.lifetimeBalance,
    totalChoppingHours: props.xp && getNumberWithCommas((props.xp / 60).toFixed(0)),
    isLatestCompletedRedeemedRewardsLoading: props.vault.isLatestCompletedRedeemedRewardsLoading,
    redeemedRewards: props.vault.redemptions,
    latestCompletedRedeemedRewards: props.vault.latestCompletedRedeemedRewards,
    last24HrEarnings: props.balance.lastDayEarnings,
    last7DayEarnings: props.balance.lastWeekEarnings,
    last30DayEarnings: props.balance.lastMonthEarnings,
    bonusEarningRate: props.bonusEarningRate,
    machines: props.balance.machines,
    currentHourlyEarningRatesPerMachine: props.balance.currentHourlyEarningRatesPerMachine,
    daysShowing: props.balance.daysShowingEarnings,
    hasDedicatedNodesAccess: props.hasDedicatedNodesAccess,
    trackEarnPageFAQLinkClicked: store.analytics.trackEarnPageFAQLinkClicked,
    trackEarnPageViewed: store.analytics.trackEarnPageViewed,
    trackAndNavigateToRewardVaultPage,
    viewLast24Hours: store.balance.viewLast24Hours,
    viewLast7Days: store.balance.viewLast7Days,
    viewLast30Days: store.balance.viewLast30Days,
    onPageMachineIdsChange: props.onPageMachineIdsChange,
  }
}

const ConnectedEarningSummary = connect(mapStoreToProps, EarningSummaryPage)

/**
 * The earnings summary page. While it is open it loads the machines' earning histories (at most once an hour), the
 * current earning rates of the machines on the shown page of the machine list (every minute), and the redeemed rewards
 * and balance (every 2 minutes). The data stays in the stores, which the page reads.
 */
export const EarningSummaryContainer = () => {
  const store = getStore()
  const navigation = useNavigation()
  const [pageMachineIds, setPageMachineIds] = useState<string[]>([])
  useMachineEarningsHistory(store.balance.loadEarningsPerMachine)
  useMachineEarningRates(pageMachineIds, store.balance.loadCurrentEarningRatesPerMachine)
  useVaultRefresh(store.vault.refresh)
  const xp = useXp()
  const bonusEarningRate = useEarningRateBonus()
  const balance = useExternalState(store.balance.state)
  const { loadedEarningsPerMachine, daysShowingEarnings } = balance
  // Charting every machine's history is costly, so it runs again only when the history or the chart range changes.
  const earningsPerMachine = useMemo(
    () => earningsPerMachineOf(loadedEarningsPerMachine, daysShowingEarnings),
    [loadedEarningsPerMachine, daysShowingEarnings],
  )
  return (
    <ConnectedEarningSummary
      xp={xp}
      bonusEarningRate={bonusEarningRate}
      onNavigateToVault={() => navigation.push('/store/vault')}
      onPageMachineIdsChange={setPageMachineIds}
      balance={balance}
      earningsPerMachine={earningsPerMachine}
      hasDedicatedNodesAccess={useExternalState(store.dedicatedNodes.state).hasAccess}
      vault={useExternalState(store.vault.state)}
    />
  )
}
