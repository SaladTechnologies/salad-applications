import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { Machine } from '../../../api/machinesApiClient/generated/models'
import { Scrollbar } from '../../../components'
import { withLogin } from '../../auth-views'
import type { CurrentHourlyEarningRatesPerMachine, EarningPerMachine } from '../../balance/models'
import type { RedeemedReward } from '../../balance/models/RedeemedReward'
import type { RewardVaultItem } from '../../vault/models'
import {
  EarningFrequentlyAskedQuestions,
  EarningHistoryContainer,
  EarningSummary,
  LatestRewardsRedeemed,
} from '../components'
import { AllMachines } from '../components/AllMachines'
import { MachineDetailsModal } from '../components/AllMachines/MachineDetailsModal'
import { mockEarningPerMachine } from '../components/AllMachines/mocks'
import { getMachineDetailsList } from '../components/AllMachines/utils'

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
  isLatestCompletedRedeemedRewardsLoading: boolean
  machines: Machine[] | null
  currentHourlyEarningRatesPerMachine: CurrentHourlyEarningRatesPerMachine
  fetchCurrentEarningRatesPerMachine: () => void
  startRedemptionsRefresh: () => void
  stopRedemptionsRefresh: () => void
  navigateToRewardVaultPage: () => void
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
  isLatestCompletedRedeemedRewardsLoading,
  machines,
  currentHourlyEarningRatesPerMachine,
  fetchCurrentEarningRatesPerMachine,
  startRedemptionsRefresh,
  stopRedemptionsRefresh,
  trackAndNavigateToRewardVaultPage,
  trackEarnPageFAQLinkClicked,
  trackEarnPageViewed,
}) => {
  const [detailsModalMachineId, setDetailsModalMachineId] = useState<string | null>(null)
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([])

  const handleCloseMachineDetailsModal = () => {
    setDetailsModalMachineId(null)
  }

  const handleSelectedMachineIdsChange = useCallback((updatedSelectedMachineIds: string[]) => {
    setSelectedMachineIds(updatedSelectedMachineIds)
  }, [])

  useEffect(() => {
    fetchCurrentEarningRatesPerMachine()
  }, [fetchCurrentEarningRatesPerMachine])

  useEffect(() => {
    startRedemptionsRefresh()
    trackEarnPageViewed()

    return () => {
      stopRedemptionsRefresh()
    }
  }, [startRedemptionsRefresh, stopRedemptionsRefresh, trackEarnPageViewed])

  const latestCompletedRedeemedRewardsArray: RedeemedReward[] = Array.from(latestCompletedRedeemedRewards.values())

  const redeemedRewardsCount = redeemedRewards?.length ?? 0

  const earningPerSelectedMachines = Object.keys(selectedMachineIds)
    .filter((id) => selectedMachineIds.includes(id))
    .reduce<EarningPerMachine>((acc, id) => {
      // Mocked data for earnings per machine
      if (mockEarningPerMachine[id]) {
        acc[id] = mockEarningPerMachine[id]
      }
      return acc
    }, {})

  const machineDetailsList = machines ? getMachineDetailsList({ machines, currentHourlyEarningRatesPerMachine }) : []

  const shownInModalMachineDetails = machineDetailsList.find(
    (machineDetails) => machineDetails.id === detailsModalMachineId,
  )

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
        <AllMachines
          machineDetailsList={machineDetailsList}
          onMachineIdClick={setDetailsModalMachineId}
          onSelectedMachineIdsChange={handleSelectedMachineIdsChange}
        />
        <EarningHistoryContainer earningsPerMachine={earningPerSelectedMachines} />
        {shownInModalMachineDetails && (
          <MachineDetailsModal
            machineDetails={shownInModalMachineDetails}
            onCloseClick={handleCloseMachineDetailsModal}
          />
        )}
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
