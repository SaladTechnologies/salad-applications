import { useState } from 'react'
import { connect } from '../../connect'
import type { BonusEarningRate } from '../../account/bonuses.ts'
import { useEarningRateBonus } from '../../account/bonuses.ts'
import { useXp } from '../../account/xp.ts'
import { useMachineEarningRates, useMachineEarningsHistory } from '../../earnings/machine-earnings.ts'
import { useVaultRefresh } from '../../rewards/vault.ts'
import { useNavigation } from '../../routing/navigation-context.ts'
import type { RootStore } from '../../Store'
import { getStore } from '../../Store'
import { EarningSummaryPage } from './pages/EarningSummaryPage'
import { getNumberWithCommas } from './utils'

interface OwnProps {
  xp: number
  bonusEarningRate: BonusEarningRate | undefined
  onNavigateToVault: () => void
  onPageMachineIdsChange: (machineIds: string[]) => void
}

const mapStoreToProps = (store: RootStore, props: OwnProps): any => {
  const trackAndNavigateToRewardVaultPage = () => {
    store.analytics.trackEarnPageVaultButtonClicked()
    props.onNavigateToVault()
  }

  return {
    currentBalance: store.balance.currentBalance,
    earningsPerMachine: store.balance.earningsPerMachine,
    lifetimeBalance: store.balance.lifetimeBalance,
    totalChoppingHours: props.xp && getNumberWithCommas((props.xp / 60).toFixed(0)),
    isLatestCompletedRedeemedRewardsLoading: store.vault.isLatestCompletedRedeemedRewardsLoading,
    redeemedRewards: store.vault.redemptions,
    latestCompletedRedeemedRewards: store.vault.latestCompletedRedeemedRewards,
    last24HrEarnings: store.balance.lastDayEarnings,
    last7DayEarnings: store.balance.lastWeekEarnings,
    last30DayEarnings: store.balance.lastMonthEarnings,
    bonusEarningRate: props.bonusEarningRate,
    machines: store.balance.machines,
    currentHourlyEarningRatesPerMachine: store.balance.currentHourlyEarningRatesPerMachine,
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
  return (
    <ConnectedEarningSummary
      xp={xp}
      bonusEarningRate={bonusEarningRate}
      onNavigateToVault={() => navigation.push('/store/vault')}
      onPageMachineIdsChange={setPageMachineIds}
    />
  )
}
