import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { Segments } from '../../../../components/elements/Segments'
import { EarningLineChartContainer } from '../../EarningLineChartContainer'
import { EarningTableContainer } from '../../EarningTableContainer'
import { EarnSectionHeader } from '../EarnSectionHeader'
import { ViewData, ViewRange, ViewType } from './constants'

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
    height: '300px',
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
  viewLast24Hours: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
}

const _EarningHistory = ({ classes, viewLast24Hours, viewLast7Days, viewLast30Days }: Props) => {
  const [viewType, setViewType] = useState<ViewType>(ViewType.Graph)
  const [viewRange, setViewRange] = useState<ViewRange>(ViewRange.Last24Hours)
  const [viewData, setViewData] = useState<ViewData>(ViewData.Individual)

  const [isIndividualViewDataDisabled, setIsIndividualViewDataDisabled] = useState<boolean>(false)

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
    <div className={classes.earningHistoryWrapper}>
      <EarnSectionHeader>Earning History</EarnSectionHeader>
      <div className={classes.chartWrapper}>
        <div className={classes.chartHeader}>
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
        </div>
        <div className={classes.chartContainer}>
          {viewType === ViewType.Graph && (
            <EarningLineChartContainer
              viewData={viewData}
              setIsIndividualViewDataDisabled={setIsIndividualViewDataDisabled}
              setViewData={setViewData}
            />
          )}
          {viewType === ViewType.Table && <EarningTableContainer />}
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
