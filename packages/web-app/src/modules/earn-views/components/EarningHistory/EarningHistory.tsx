import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useEffect, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { Segments } from '../../../../components/elements/Segments'
import type { ChartDaysShowing, EarningPerMachine } from '../../../balance/models'
import { EarnSectionHeader } from '../EarnSectionHeader'
import { EarningLineChart } from '../EarningLineChart'
import { EarningTable } from '../EarningTable'
import { maximumMachinesForIndividualView, ViewData, ViewRange, ViewType } from './constants'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties | Record<string, CSS.Properties>> = (
  theme: SaladTheme,
) => ({
  earningHistoryWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
  },
  chartWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    position: 'relative',
    height: '200px',
    width: '100%',
  },
  chartContainer: {
    display: 'flex',
    height: '328px',
    position: 'relative',
    flexDirection: 'column',
  },
  subtitle: {
    fontFamily: 'Mallory',
    fontSize: '16px',
    color: theme.lightGreen,
    margin: '8px 0px 0px',
    lineHeight: '1.5',
    marginTop: '32px',
    marginBottom: '10px',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: '32px',
  },
  descriptionWrapper: {
    paddingLeft: '70px',
    color: theme.lightGreen,
  },
})

interface Props extends WithStyles<typeof styles> {
  daysShowing: ChartDaysShowing
  earningsPerMachine: EarningPerMachine
  viewLast24Hours: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
  trackEarningHistoryFilterClicked: (timeFilter: ViewRange, viewFilter: ViewType, aggregationFilter: ViewData) => void
}

const _EarningHistory = ({
  classes,
  daysShowing,
  earningsPerMachine,
  viewLast24Hours,
  viewLast7Days,
  viewLast30Days,
  trackEarningHistoryFilterClicked,
}: Props) => {
  const [viewType, setViewType] = useState<ViewType>(ViewType.Graph)
  const [viewRange, setViewRange] = useState<ViewRange>(ViewRange.Last24Hours)
  const [viewData, setViewData] = useState<ViewData>(ViewData.Individual)

  const [isIndividualViewDataDisabled, setIsIndividualViewDataDisabled] = useState<boolean>(false)

  useEffect(() => {
    if (Object.values(earningsPerMachine).length > maximumMachinesForIndividualView) {
      setViewData(ViewData.Aggregate)
      setIsIndividualViewDataDisabled(true)
    } else {
      setIsIndividualViewDataDisabled(false)
    }
  }, [earningsPerMachine])

  const handleViewChange = (newViewRange: ViewRange, newViewType: ViewType, newViewData: ViewData) => {
    setViewRange(newViewRange)
    setViewType(newViewType)
    setViewData(newViewData)
    trackEarningHistoryFilterClicked(newViewRange, newViewType, newViewData)
  }

  const viewTypeOptions = [
    {
      name: ViewType.Graph,
      action: () => handleViewChange(viewRange, ViewType.Graph, viewData),
    },
    {
      name: ViewType.Table,
      action: () => handleViewChange(viewRange, ViewType.Table, viewData),
    },
  ]

  const viewRangeOptions = [
    {
      name: ViewRange.Last24Hours,
      action: () => {
        viewLast24Hours()
        handleViewChange(ViewRange.Last24Hours, viewType, viewData)
      },
    },
    {
      name: ViewRange.Last7Days,
      action: () => {
        viewLast7Days()
        handleViewChange(ViewRange.Last7Days, viewType, viewData)
      },
    },
    {
      name: ViewRange.Last30Days,
      action: () => {
        viewLast30Days()
        handleViewChange(ViewRange.Last30Days, viewType, viewData)
      },
    },
  ]

  const viewDataOptions = [
    {
      name: ViewData.Individual,
      action: () => handleViewChange(viewRange, viewType, ViewData.Individual),
      disabled: isIndividualViewDataDisabled,
    },
    {
      name: ViewData.Aggregate,
      action: () => handleViewChange(viewRange, viewType, ViewData.Aggregate),
    },
  ]

  const handleTypeOptionChange = (name: ViewType) => {
    viewTypeOptions.find((option) => option.name === name)?.action()
  }

  const handleRangeOptionChange = (name: ViewRange) => {
    viewRangeOptions.find((option) => option.name === name)?.action()
  }

  const handleDataOptionChange = (name: ViewData) => {
    viewDataOptions.find((option) => option.name === name && !option.disabled)?.action()
  }

  return (
    <div className={classes.earningHistoryWrapper}>
      <EarnSectionHeader>Earning History</EarnSectionHeader>
      <div className={classes.chartWrapper}>
        <div className={classes.chartHeader}>
          <div>
            <p className={classes.subtitle}>View Type</p>
            <Segments
              options={viewTypeOptions}
              onOptionChange={(name) => handleTypeOptionChange(name as ViewType)}
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
        </div>
        <div className={classes.chartContainer}>
          {viewType === ViewType.Graph && (
            <EarningLineChart daysShowing={daysShowing} earningsPerMachine={earningsPerMachine} viewData={viewData} />
          )}
          {viewType === ViewType.Table && (
            <EarningTable daysShowing={daysShowing} earningsPerMachine={earningsPerMachine} viewData={viewData} />
          )}
        </div>
        <div className={classes.descriptionWrapper}>
          <Text variant="baseXS">
            *Per machine earnings don’t include referral earnings, earning rate multipliers or any other kind of bonus
            earnings.
          </Text>
        </div>
      </div>
    </div>
  )
}

export const EarningHistory = withStyles(styles)(_EarningHistory)
