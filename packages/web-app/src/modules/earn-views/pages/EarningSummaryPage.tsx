import moment from 'moment'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Scrollbar } from '../../../components'
import { withLogin } from '../../auth-views'
import type { ChartDaysShowing, EarningPerMachine } from '../../balance/models'
import type { RedeemedReward } from '../../balance/models/RedeemedReward'
import type { RewardVaultItem } from '../../vault/models'
import { EarningFrequentlyAskedQuestions, EarningHistory, EarningSummary, LatestRewardsRedeemed } from '../components'
import { AllMachines } from '../components/AllMachines'
import { generatedMockedMachines } from '../components/AllMachines/mocks'
import { MachineDetailsModal } from '../components/MachineDetailsModal'

const styles = () => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '80px',
    margin: 60,
  },
})

interface Props extends WithStyles<typeof styles> {
  daysShowing: ChartDaysShowing
  currentBalance?: number
  lifetimeBalance?: number
  totalChoppingHours?: number
  redeemedRewards?: RewardVaultItem[]
  latestCompletedRedeemedRewards: Map<string, RedeemedReward>
  last24HrEarnings: number
  last7DayEarnings: number
  last30DayEarnings: number
  startRedemptionsRefresh: () => void
  stopRedemptionsRefresh: () => void
  navigateToRewardVaultPage: () => void
  isLatestCompletedRedeemedRewardsLoading: boolean
  trackAndNavigateToRewardVaultPage: () => void
  trackEarnPageFAQLinkClicked: (faqLink: string) => void
  trackEarnPageViewed: () => void
  viewLast24Hours: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
}

const _EarningSummaryPage: FC<Props> = ({
  classes,
  currentBalance,
  daysShowing,
  lifetimeBalance,
  totalChoppingHours,
  redeemedRewards,
  latestCompletedRedeemedRewards,
  last24HrEarnings,
  last7DayEarnings,
  last30DayEarnings,
  startRedemptionsRefresh,
  stopRedemptionsRefresh,
  isLatestCompletedRedeemedRewardsLoading,
  trackAndNavigateToRewardVaultPage,
  trackEarnPageFAQLinkClicked,
  trackEarnPageViewed,
  viewLast24Hours,
  viewLast7Days,
  viewLast30Days,
}) => {
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null)

  const handleCloseMachineDetailsModal = () => {
    setSelectedMachineId(null)
  }

  useEffect(() => {
    startRedemptionsRefresh()
    trackEarnPageViewed()

    return () => {
      stopRedemptionsRefresh()
    }
  }, [startRedemptionsRefresh, stopRedemptionsRefresh, trackEarnPageViewed])

  const latestCompletedRedeemedRewardsArray: RedeemedReward[] = Array.from(latestCompletedRedeemedRewards.values())

  const redeemedRewardsCount = redeemedRewards?.length ?? 0

  const selectedMachine = generatedMockedMachines.find((machine) => machine.id === selectedMachineId)

  // Mocked data for selected machine IDs
  const [selectedMachineIds] = useState<Record<string, boolean>>({ 'id-1': true })

  // Mocked data for earnings per machine
  const mockEarningPerMachine: EarningPerMachine = {
    'id-1': Array.from({ length: 30 }, (_, i) => ({
      timestamp: moment().subtract(i, 'days'),
      earnings: parseFloat((Math.random() * 1).toFixed(2)),
    })).reverse(),
  }

  const earningPerSelectedMachines = Object.keys(selectedMachineIds)
    .filter((id) => selectedMachineIds[id])
    .reduce<EarningPerMachine>((acc, id) => {
      if (mockEarningPerMachine[id]) {
        acc[id] = mockEarningPerMachine[id]
      }
      return acc
    }, {})

  return (
    <Scrollbar>
      <div className={classes.content}>
        <EarningSummary
          currentBalance={currentBalance}
          last24HrEarnings={last24HrEarnings}
          last7DayEarnings={last7DayEarnings}
          last30DayEarnings={last30DayEarnings}
          lifetimeBalance={lifetimeBalance}
          redeemedRewardsCount={redeemedRewardsCount}
          totalChoppingHours={totalChoppingHours}
        />
        <AllMachines machines={generatedMockedMachines} onMachineIdClick={setSelectedMachineId} />
        <EarningHistory
          daysShowing={daysShowing}
          earningPerSelectedMachines={earningPerSelectedMachines}
          viewLast24Hours={viewLast24Hours}
          viewLast7Days={viewLast7Days}
          viewLast30Days={viewLast30Days}
        />
        {selectedMachine && <MachineDetailsModal {...selectedMachine} onCloseClick={handleCloseMachineDetailsModal} />}
        <LatestRewardsRedeemed
          latestCompletedRedeemedRewards={latestCompletedRedeemedRewardsArray}
          navigateToRewardVaultPage={trackAndNavigateToRewardVaultPage}
          isLatestCompletedRedeemedRewardsLoading={isLatestCompletedRedeemedRewardsLoading}
        />
        <EarningFrequentlyAskedQuestions trackFAQLinkClicked={trackEarnPageFAQLinkClicked} />
      </div>
    </Scrollbar>
  )
}

export const EarningSummaryPage = withLogin(withStyles(styles)(_EarningSummaryPage))
