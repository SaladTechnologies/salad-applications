import type { FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import { formatBalance } from '../../../utils'
import { BalanceStat } from './BalanceStat'
import { EarnSectionHeader } from './EarnSectionHeader'

const styles = (theme: SaladTheme) => ({
  row: {
    paddingTop: 20,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridAutoRows: 'minmax(100px, auto)',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  subtitle: {
    fontFamily: 'Mallory',
    fontSize: 16,
    color: theme.lightGreen,
    margin: '8px 0px 0px',
    lineHeight: 1.5,
  },
})

interface Props extends WithStyles<typeof styles> {
  currentBalance?: number
  last24HrEarnings: number
  last7DayEarnings: number
  last30DayEarnings: number
  lifetimeBalance?: number
  totalChoppingHours?: number
  redeemedRewardsCount: number
}

export const EarningSummaryRaw: FC<Props> = ({
  classes,
  currentBalance,
  last24HrEarnings,
  last7DayEarnings,
  last30DayEarnings,
  lifetimeBalance,
  totalChoppingHours,
  redeemedRewardsCount,
}) => {
  const getRedeemedRewardsCountText = (count: number) => {
    if (count === 1) {
      return `${count} reward`
    }

    return `${count} rewards`
  }
  const getTotalChoppingHoursText = (count?: number) => {
    if (!count) {
      return `0 hours`
    }

    if (count === 1) {
      return `${count} hour`
    }

    return `${count} hours`
  }

  return (
    <div>
      <EarnSectionHeader>Earning Summary</EarnSectionHeader>
      <p className={classes.subtitle}>Take a birds eye view on how you’ve used Salad to earn rewards.</p>
      <div className={classes.row}>
        <BalanceStat title="Current Balance" value={formatBalance(currentBalance)} />
        <BalanceStat title="Lifetime Balance" value={formatBalance(lifetimeBalance)} />
        <BalanceStat title="Total Chopping Hours" value={getTotalChoppingHoursText(totalChoppingHours)} />
        <BalanceStat title="Number of Rewards Redeemed" value={getRedeemedRewardsCountText(redeemedRewardsCount)} />
        <BalanceStat title="Earnings last 24 hours" value={formatBalance(last24HrEarnings)} />
        <BalanceStat title="Earnings last 7 days" value={formatBalance(last7DayEarnings)} />
        <BalanceStat title="Earnings last 30 days" value={formatBalance(last30DayEarnings)} />
      </div>
    </div>
  )
}

export const EarningSummary = withStyles(styles)(EarningSummaryRaw)
