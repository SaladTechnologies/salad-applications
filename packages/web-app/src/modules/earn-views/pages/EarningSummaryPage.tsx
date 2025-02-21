import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
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
import { getMachineDetailsList } from '../components/AllMachines/utils'
import { oneMinuteInMilliseconds } from './constants'

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
  earningsPerMachine: EarningPerMachine
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
  fetchCurrentEarningRatesPerMachine: (machineIds?: string[]) => void
  fetchEarningsPerMachine: () => void
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
  earningsPerMachine,
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
  fetchEarningsPerMachine,
  startRedemptionsRefresh,
  stopRedemptionsRefresh,
  trackAndNavigateToRewardVaultPage,
  trackEarnPageFAQLinkClicked,
  trackEarnPageViewed,
}) => {
  const [detailsModalMachineId, setDetailsModalMachineId] = useState<string | null>(null)
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([])
  const [pageMachineIds, setPageMachineIds] = useState<string[]>([])
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleCloseMachineDetailsModal = () => {
    setDetailsModalMachineId(null)
  }

  const handleSelectedMachineIdsChange = useCallback((updatedSelectedMachineIds: string[]) => {
    setSelectedMachineIds(updatedSelectedMachineIds)
  }, [])

  const handlePageChange = useCallback((updatedPageMachineIds: string[]) => {
    setPageMachineIds(updatedPageMachineIds)
  }, [])

  useEffect(() => {
    fetchEarningsPerMachine()
  }, [fetchEarningsPerMachine])

  useEffect(() => {
    fetchCurrentEarningRatesPerMachine(pageMachineIds)
    updateTimerRef.current = setInterval(() => {
      fetchCurrentEarningRatesPerMachine(pageMachineIds)
    }, oneMinuteInMilliseconds)

    return () => {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current)
      }
    }
  }, [fetchCurrentEarningRatesPerMachine, pageMachineIds])

  useEffect(() => {
    startRedemptionsRefresh()
    trackEarnPageViewed()

    return () => {
      stopRedemptionsRefresh()
    }
  }, [startRedemptionsRefresh, stopRedemptionsRefresh, trackEarnPageViewed])

  const latestCompletedRedeemedRewardsArray: RedeemedReward[] = Array.from(latestCompletedRedeemedRewards.values())

  const redeemedRewardsCount = redeemedRewards?.length ?? 0

  const earningsPerSelectedMachines = selectedMachineIds.reduce<EarningPerMachine>((acc, id) => {
    if (earningsPerMachine[id]) {
      acc[id] = earningsPerMachine[id]
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
          onPageChange={handlePageChange}
        />
        <EarningHistoryContainer earningsPerMachine={earningsPerSelectedMachines} />
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
