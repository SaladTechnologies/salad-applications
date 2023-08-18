import type { FC } from 'react'
import { useEffect } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Scrollbar, SectionHeader } from '../../../components'
import { withLogin } from '../../auth-views'
import type { RedeemedReward } from '../../balance/models/RedeemedReward'
import type { RewardVaultItem } from '../../vault/models'
import { RewardVaultStatus } from '../../vault/models'
import { PantryContainer, SlicedVeggieContainer } from '../../xp-views'
import { EarningHistory, EarningSummary, LatestRewardsRedeemed } from '../components'
import { EarningInformationPage } from './EarningInformationPage'

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
  startRedemptionsRefresh: () => void
  stopRedemptionsRefresh: () => void
  navigateToRewardVaultPage: () => void
}

const EarningSummaryPageRaw: FC<Props> = ({
  classes,
  currentBalance,
  lifetimeBalance,
  totalChoppingHours,
  redeemedRewards,
  startRedemptionsRefresh,
  stopRedemptionsRefresh,
  navigateToRewardVaultPage,
}) => {
  useEffect(() => {
    startRedemptionsRefresh()

    return () => {
      stopRedemptionsRefresh()
    }
  }, [startRedemptionsRefresh, stopRedemptionsRefresh])

  const sortByDate = (a: RedeemedReward, b: RedeemedReward): number =>
    new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1

  const latestCompletedRedeemedRewards = redeemedRewards
    ?.filter((redemption) => redemption.status === RewardVaultStatus.COMPLETE)
    .slice(-4)
    .sort(sortByDate)

  const redeemedRewardsCount = redeemedRewards?.length ?? 0

  return (
    <>
      <SlicedVeggieContainer />
      <Scrollbar>
        <div className={classes.content}>
          <EarningSummary
            currentBalance={currentBalance}
            lifetimeBalance={lifetimeBalance}
            redeemedRewardsCount={redeemedRewardsCount}
            totalChoppingHours={totalChoppingHours}
          />
          <EarningHistory />
          <LatestRewardsRedeemed
            latestCompletedRedeemedRewards={latestCompletedRedeemedRewards}
            navigateToRewardVaultPage={navigateToRewardVaultPage}
          />
          <SectionHeader>Pantry</SectionHeader>
          <PantryContainer />
        </div>
      </Scrollbar>
    </>
  )
}

export const EarningSummaryPage = withLogin(withStyles(styles)(EarningSummaryPageRaw), EarningInformationPage)
