import type { FC } from 'react'
import { useEffect } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Scrollbar } from '../../../components'
import { withLogin } from '../../auth-views'
import type { EarningWindow } from '../../balance/models'
import type { RedeemedReward } from '../../balance/models/RedeemedReward'
import type { BonusEarningRate } from '../../bonus/models'
import type { RewardVaultItem } from '../../vault/models'
import { EarningFrequentlyAskedQuestions, EarningHistory, EarningSummary, LatestRewardsRedeemed } from '../components'

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
  startRedemptionsRefresh: () => void
  stopRedemptionsRefresh: () => void
  last24Hr?: number
  last7Day?: number
  last30Day?: number
  earningHistory?: EarningWindow[]
  bonusEarningRate?: BonusEarningRate
  isLatestCompletedRedeemedRewardsLoading: boolean
  trackAndNavigateToRewardVaultPage: () => void
  trackEarnPageFAQLinkClicked: (faqLink: string) => void
  trackEarnPageViewed: () => void
}

const EarningSummaryPageRaw: FC<Props> = ({
  classes,
  currentBalance,
  lifetimeBalance,
  totalChoppingHours,
  redeemedRewards,
  latestCompletedRedeemedRewards,
  last24Hr,
  last7Day,
  last30Day,
  earningHistory,
  startRedemptionsRefresh,
  stopRedemptionsRefresh,
  isLatestCompletedRedeemedRewardsLoading,
  trackAndNavigateToRewardVaultPage,
  trackEarnPageFAQLinkClicked,
  trackEarnPageViewed,
}) => {
  useEffect(() => {
    startRedemptionsRefresh()
    trackEarnPageViewed()

    return () => {
      stopRedemptionsRefresh()
    }
  }, [startRedemptionsRefresh, stopRedemptionsRefresh, trackEarnPageViewed])

  const latestCompletedRedeemedRewardsArray: RedeemedReward[] = Array.from(latestCompletedRedeemedRewards.values())

  const redeemedRewardsCount = redeemedRewards?.length ?? 0

  return (
    <Scrollbar>
      <div className={classes.content}>
        <EarningSummary
          currentBalance={currentBalance}
          lifetimeBalance={lifetimeBalance}
          redeemedRewardsCount={redeemedRewardsCount}
          totalChoppingHours={totalChoppingHours}
        />
        <EarningHistory last24Hr={last24Hr} last7Day={last7Day} last30Day={last30Day} earningHistory={earningHistory} />
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

export const EarningSummaryPage = withLogin(withStyles(styles)(EarningSummaryPageRaw))
