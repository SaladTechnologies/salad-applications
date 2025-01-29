import { useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import { Divider, SectionHeader, StatElement } from '../../../components'
import { Segments } from '../../../components/elements/Segments'
import { formatBalance } from '../../../utils'
import { EarningChartContainer } from '../../earn-views'
import { EarningLineChartContainer } from '../../earn-views/EarningLineChartContainer'
import { ViewData, ViewRange, ViewType } from '../../earn-views/components/EarningHistory/utils'

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
  segmentsContainer: {
    '&>label:first-child': {
      borderRadius: '2px 0px 0px 2px',
    },
    '&>label:last-child': {
      borderRadius: '0px 2px 2px 0px',
    },
  },
  descriptionWrapper: {
    paddingLeft: '70px',
    color: theme.lightGreen,
  },
  subtitle: {
    fontFamily: 'Mallory',
    fontSize: '16px',
    color: theme.lightGreen,
    lineHeight: '1.5',
    marginBottom: '10px',
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

const _MobileEarningSummary = ({
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
  const [viewType, setViewType] = useState<ViewType>(ViewType.Graph)
  const [viewRange, setViewRange] = useState<ViewRange>(ViewRange.Last24Hours)
  const [viewData, setViewData] = useState<ViewData>(ViewData.Individual)

  const [isIndividualViewDataDisabled, setIsIndividualViewDataDisabled] = useState<boolean>(false)

  const isAggregateView = viewData === ViewData.Aggregate

  const viewTypeOptions = [
    { name: ViewType.Graph, action: () => setViewType(ViewType.Graph) },
    { name: ViewType.Table, action: () => setViewType(ViewType.Table) },
  ]

  const viewRangeOptions = [
    {
      name: ViewRange.Last24Hours,
      action: () => {
        viewLast24Hours()
        setViewRange(ViewRange.Last24Hours)
      },
    },
    {
      name: ViewRange.Last7Days,
      action: () => {
        viewLast7Days()
        setViewRange(ViewRange.Last7Days)
      },
    },
    {
      name: ViewRange.Last30Days,
      action: () => {
        viewLast30Days()
        setViewRange(ViewRange.Last30Days)
      },
    },
  ]

  const viewDataOptions = [
    {
      name: ViewData.Individual,
      action: () => setViewData(ViewData.Individual),
      disabled: isIndividualViewDataDisabled,
    },
    {
      name: ViewData.Aggregate,
      action: () => {
        setViewData(ViewData.Aggregate)
      },
    },
  ]

  const handleRangeOptionChange = (name: ViewRange) => {
    viewRangeOptions.find((option) => option.name === name)?.action()
  }

  const handleDataOptionChange = (name: ViewData) => {
    viewDataOptions.find((option) => option.name === name && !option.disabled)?.action()
  }

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
      <div>
        <p className={classes.subtitle}>View Type</p>
        <Segments
          options={viewTypeOptions}
          onOptionChange={(name) => setViewType(name as ViewType)}
          selectedOptionName={viewType}
        />
      </div>
      <div>
        <p className={classes.subtitle}>View Range</p>
        <Segments
          options={viewRangeOptions}
          onOptionChange={(name) => handleRangeOptionChange(name as ViewRange)}
          selectedOptionName={viewRange}
        />
      </div>
      <div>
        <p className={classes.subtitle}>View Data as</p>
        <Segments
          options={viewDataOptions}
          onOptionChange={(name) => handleDataOptionChange(name as ViewData)}
          selectedOptionName={viewData}
        />
      </div>
      <div className={classes.chartContainer}>
        {viewType === ViewType.Graph && (
          <EarningLineChartContainer
            isAggregateView={isAggregateView}
            viewData={viewData}
            setIsIndividualViewDataDisabled={setIsIndividualViewDataDisabled}
            setViewData={setViewData}
          />
        )}
        {viewType === ViewType.Table && <EarningChartContainer />}
      </div>
      <Divider />
    </>
  )
}

export const MobileEarningSummary = withStyles(styles)(_MobileEarningSummary)
