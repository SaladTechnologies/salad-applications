import { Switch, Text } from '@saladtechnologies/garden-components'
import { useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import { Divider, SectionHeader, StatElement } from '../../../components'
import { OldSegments } from '../../../components/elements/OldSegments'
import { formatBalance } from '../../../utils'
import { EarningChartContainer } from '../../earn-views'
import { EarningLineChartContainer } from '../../earn-views/EarningLineChartContainer'

const styles = (theme: SaladTheme) => ({
  item: {
    paddingTop: 10,
  },
  chartContainer: {
    display: 'flex',
    height: 250,
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  segmentsContainer: {
    '&>label:first-child': {
      borderRadius: '2px 0px 0px 2px',
    },
    '&>label:last-child': {
      borderRadius: '0px 2px 2px 0px',
    },
  },
  earningPerMachineSwitchWrapper: {
    marginLeft: 32,
  },
  descriptionWrapper: {
    paddingLeft: '70px',
    color: theme.lightGreen,
  },
})

interface Props extends WithStyles<typeof styles> {
  currentBalance?: number
  last24HrEarnings: number
  last7DayEarnings: number
  last30DayEarnings: number
  lifetimeBalance?: number
  totalXp?: number
  viewLast24Hours: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
}

const _OldMobileEarningSummary = ({
  classes,
  currentBalance,
  last24HrEarnings,
  last7DayEarnings,
  last30DayEarnings,
  lifetimeBalance,
  totalXp,
  viewLast24Hours,
  viewLast7Days,
  viewLast30Days,
}: Props) => {
  const [isEarningsPerMachineEnabled, setIsEarningsPerMachineEnabled] = useState(false)
  const segmentOptions = [
    { name: '24 Hours', action: viewLast24Hours },
    { name: '7 Days', action: viewLast7Days },
    { name: '30 Days', action: viewLast30Days },
  ]

  return (
    <>
      <SectionHeader>Summary</SectionHeader>
      <div className={classes.item}>
        <StatElement
          title="Current Balance"
          values={[formatBalance(currentBalance)]}
          infoText="Current balance available to spend"
        />
      </div>
      <div className={classes.item}>
        <StatElement
          title="Lifetime Balance"
          values={[formatBalance(lifetimeBalance)]}
          infoText="Total balance earned"
        />
      </div>
      <div className={classes.item}>
        <StatElement
          title="Total XP"
          values={[Math.round(totalXp ?? 0).toLocaleString()]}
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
      <div className={classes.chartHeader}>
        <div className={classes.segmentsContainer}>
          <OldSegments options={segmentOptions} />
        </div>
        <div className={classes.earningPerMachineSwitchWrapper}>
          <Switch
            label="Earnings Per Machine"
            checked={isEarningsPerMachineEnabled}
            onChange={setIsEarningsPerMachineEnabled}
            variant="light"
          />
        </div>
      </div>
      <div className={classes.chartContainer}>
        {isEarningsPerMachineEnabled ? <EarningLineChartContainer /> : <EarningChartContainer />}
      </div>
      {isEarningsPerMachineEnabled && (
        <div className={classes.descriptionWrapper}>
          <Text variant="baseXS">
            *Per machine earnings don’t include referral earnings, earning rate multipliers or any other kind of bonus
            earnings.
          </Text>
        </div>
      )}
      <Divider />
    </>
  )
}

export const OldMobileEarningSummary = withStyles(styles)(_OldMobileEarningSummary)
