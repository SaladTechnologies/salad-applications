import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Divider, SectionHeader, StatElement } from '../../../components'
import { formatBalance } from '../../../utils'
import { EarningChartContainer } from '../../earn-views'

const styles = () => ({
  container: {},
  item: {
    paddingTop: 10,
  },
})

interface Props extends WithStyles<typeof styles> {
  currentBalance?: number
  last24HrEarnings: number
  last7DayEarnings: number
  last30DayEarnings: number
  lifetimeBalance?: number
  totalXp?: number
}

const _MobileEarningSummary = ({
  classes,
  currentBalance,
  last24HrEarnings,
  last7DayEarnings,
  last30DayEarnings,
  lifetimeBalance,
  totalXp,
}: Props) => (
  <div className={classes.container}>
    <SectionHeader>Summary</SectionHeader>
    <div className={classes.item}>
      <StatElement
        title="Current Balance"
        values={[formatBalance(currentBalance)]}
        infoText="Current balance available to spend"
      />
    </div>
    <div className={classes.item}>
      <StatElement title="Lifetime Balance" values={[formatBalance(lifetimeBalance)]} infoText="Total balance earned" />
    </div>
    <div className={classes.item}>
      <StatElement
        title="Total XP"
        values={[Math.round(totalXp || 0).toLocaleString() || '0']}
        infoText={`XP stands for "Experience Points". You are awarded 1 XP per minute of confirmed mining time. The more XP you have, the more veggies you will unlock in the Pantry.`}
      />
    </div>
    <div className={classes.item}>
      <StatElement
        title="Earnings last 24 hours"
        values={[formatBalance(last24HrEarnings)]}
        infoText="Last 24 hours balance earned"
      />
    </div>
    <div className={classes.item}>
      <StatElement
        title="Earnings last 7 days"
        values={[formatBalance(last7DayEarnings)]}
        infoText="Last 7 days balance earned"
      />
    </div>
    <div className={classes.item}>
      <StatElement
        title="Earnings last 30 days"
        values={[formatBalance(last30DayEarnings)]}
        infoText="Last 30 days balance earned"
      />
    </div>
    <Divider />
    <SectionHeader>Earning History</SectionHeader>
    <EarningChartContainer />
    <Divider />
  </div>
)

export const MobileEarningSummary = withStyles(styles)(_MobileEarningSummary)
