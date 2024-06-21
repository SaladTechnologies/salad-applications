import { Switch } from '@saladtechnologies/garden-components'
import { useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import { Segments } from '../../../components/elements/Segments'
import { EarningChartContainer } from '../EarningChartContainer'
import { EarningLineChartContainer } from '../EarningLineChartContainer'
import { EarnSectionHeader } from './EarnSectionHeader'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 860,
    position: 'relative',
  },
  chartContainer: {
    display: 'flex',
    height: 250,
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
  },
  subtitle: {
    fontFamily: 'Mallory',
    fontSize: 16,
    color: theme.lightGreen,
    margin: '8px 0px 0px',
    lineHeight: 1.5,
    marginTop: 32,
    marginBottom: 10,
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
})

interface Props extends WithStyles<typeof styles> {
  viewLast24Hours: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
}

const EarningHistoryRaw = ({ classes, viewLast24Hours, viewLast7Days, viewLast30Days }: Props) => {
  const [isEarningsPerMachineEnabled, setIsEarningsPerMachineEnabled] = useState(false)
  const segmentOptions = [
    { name: '24 Hours', action: viewLast24Hours },
    { name: '7 Days', action: viewLast7Days },
    { name: '30 Days', action: viewLast30Days },
  ]

  return (
    <div className={classes.container}>
      <EarnSectionHeader>Earning History</EarnSectionHeader>
      <p className={classes.subtitle}>See earnings from the last...</p>
      <div className={classes.chartHeader}>
        <div className={classes.segmentsContainer}>
          <Segments options={segmentOptions} />
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
    </div>
  )
}

export const EarningHistory = withStyles(styles)(EarningHistoryRaw)
