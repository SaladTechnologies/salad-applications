import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Scrollbar } from '../../../components'
import { withLogin } from '../../auth-views'
import type { RedeemedReward } from '../../balance/models/RedeemedReward'
import type { RewardVaultItem } from '../../vault/models'
import {
  EarningFrequentlyAskedQuestions,
  EarningHistoryContainer,
  EarningSummary,
  LatestRewardsRedeemed,
} from '../components'
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
}

const _EarningSummaryPage: FC<Props> = ({
  classes,
  currentBalance,
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
        <EarningHistoryContainer />
        {/* <AllMachines machines={generatedMockedMachines} onMachineIdClick={setSelectedMachineId} /> */}
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
