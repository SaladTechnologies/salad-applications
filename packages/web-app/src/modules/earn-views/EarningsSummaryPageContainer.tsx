import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EarningsSummaryPage, EarningsSummaryPageProps } from './pages/EarningsSummaryPage'

const mapStoreToProps = (store: RootStore): Omit<EarningsSummaryPageProps, 'classes'> => ({
  activeWorkloads: store.activeWorkloadsUIStore.activeWorkloads,
  currentBalance: store.balance.currentBalance,
  daysShowing: store.balance.getDaysShowingEarnings,
  isNative: store.native.isNative,
  lifetimeBalance: store.balance.lifetimeBalance,
  lifetimeXP: store.xp.currentXp,
  onViewMachineSettingsPage: () => store.routing.push('/earn/machine-settings'),
  viewLast24HR: store.balance.viewLast24Hours,
  viewLast7Days: store.balance.viewLast7Days,
  viewLast30Days: store.balance.viewLast30Days,
  earningHistory: store.balance.earningsHistory,
  hardwareDetected: store.detectedHardwareUIStore.hardwareCards,
})

export const EarningsSummaryPageContainer = connect(mapStoreToProps, EarningsSummaryPage)
