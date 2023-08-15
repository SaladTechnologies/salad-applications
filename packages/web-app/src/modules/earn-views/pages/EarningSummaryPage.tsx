import type { FC } from 'react'
import { useEffect } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Scrollbar, SectionHeader } from '../../../components'
import { withLogin } from '../../auth-views'
import type { EarningWindow } from '../../balance/models'
import type { BonusEarningRate } from '../../bonus/models'
import { PantryContainer, SlicedVeggieContainer } from '../../xp-views'
import { EarningHistory, EarningSummary } from '../components'
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
  redeemedRewardsCount: number
  startRedemptionsRefresh: () => void
  stopRedemptionsRefresh: () => void
  last24Hr?: number
  last7Day?: number
  last30Day?: number
  earningHistory?: EarningWindow[]
  bonusEarningRate?: BonusEarningRate
}

const EarningSummaryPageRaw: FC<Props> = ({
  classes,
  currentBalance,
  lifetimeBalance,
  totalChoppingHours,
  redeemedRewardsCount,
  last24Hr,
  last7Day,
  last30Day,
  earningHistory,
  startRedemptionsRefresh,
  stopRedemptionsRefresh,
}) => {
  useEffect(() => {
    startRedemptionsRefresh()

    return () => {
      stopRedemptionsRefresh()
    }
  }, [startRedemptionsRefresh, stopRedemptionsRefresh])

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
          <EarningHistory
            last24Hr={last24Hr}
            last7Day={last7Day}
            last30Day={last30Day}
            earningHistory={earningHistory}
          />
          <SectionHeader>Pantry</SectionHeader>
          <PantryContainer />
        </div>
      </Scrollbar>
    </>
  )
}

export const EarningSummaryPage = withLogin(withStyles(styles)(EarningSummaryPageRaw), EarningInformationPage)
