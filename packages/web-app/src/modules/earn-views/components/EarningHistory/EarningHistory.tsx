import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { Segments } from '../../../../components/elements/Segments'
import { EarningChartContainer } from '../../EarningChartContainer'
import { EarningLineChartContainer } from '../../EarningLineChartContainer'
import { EarnSectionHeader } from '../EarnSectionHeader'

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
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: '32px',
  },
  descriptionWrapper: {
    paddingLeft: '70px',
    color: theme.lightGreen,
  },
})

enum ViewType {
  Graph = 'Graph',
  Table = 'Table',
}

interface Props extends WithStyles<typeof styles> {
  viewLast24Hours: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
}

const EarningHistoryRaw = ({ classes, viewLast24Hours, viewLast7Days, viewLast30Days }: Props) => {
  const [viewType, setViewType] = useState<ViewType>(ViewType.Graph)

  const rangeOptions = [
    { name: '24 Hours', action: viewLast24Hours },
    { name: '7 Days', action: viewLast7Days },
    { name: '30 Days', action: viewLast30Days },
  ]

  const typeOptions = [
    { name: ViewType.Graph, action: () => setViewType(ViewType.Graph) },
    { name: ViewType.Table, action: () => setViewType(ViewType.Table) },
  ]

  const dataOptions = [
    { name: 'Individual', action: () => {} },
    { name: 'Aggregate', action: () => {} },
  ]

  return (
    <div className={classes.earningHistoryWrapper}>
      <EarnSectionHeader>Earning History</EarnSectionHeader>
      <div className={classes.chartWrapper}>
        <div className={classes.chartHeader}>
          <div>
            <p className={classes.subtitle}>View Type</p>
            <Segments options={typeOptions} />
          </div>
          <div>
            <p className={classes.subtitle}>View Range</p>
            <Segments options={rangeOptions} />
          </div>
          <div>
            <p className={classes.subtitle}>View Data as</p>
            <Segments options={dataOptions} />
          </div>
        </div>
        <div className={classes.chartContainer}>
          {viewType === ViewType.Graph && <EarningLineChartContainer />}
          {viewType === ViewType.Table && <EarningChartContainer />}
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

export const EarningHistory = withStyles(styles)(EarningHistoryRaw)
