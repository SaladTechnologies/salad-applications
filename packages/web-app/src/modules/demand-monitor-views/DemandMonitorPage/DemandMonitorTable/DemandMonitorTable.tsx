import { Text } from '@saladtechnologies/garden-components'
import classNames from 'classnames'
import type CSS from 'csstype'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import type { DemandedHardwarePerformance } from '../../DemandMonitorStore'
import { demandPillColors } from './constants'
import { getHardwareDemandLevel, sortHardwareDemandPerformance } from './utils'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  tableWrapper: {
    fontFamily: 'Mallory',
    color: theme.lightGreen,
    fontSize: '16px',
    width: '100%',
    '@media (max-width: 900px)': {
      overflow: 'scroll',
    },
  },
  tableContent: {
    overflow: 'hidden',
    borderRadius: '6px',
    border: `1px ${theme.green} solid`,
    minWidth: '970px',
    '@media (max-width: 900px)': {
      minWidth: '1000px',
    },
  },
  table: {
    width: '100%',
    borderRadius: '6px',
    borderCollapse: 'collapse',
    boxSizing: 'border-box',
  },
  greenTableCell: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
  },
  tableCell: {
    border: `1px ${theme.green} solid`,
    borderCollapse: 'collapse',
    padding: '10px 24px',
  },
  gpuWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderTop: `1px ${theme.darkBlue} solid`,
  },
  gpuName: {
    fontWeight: 700,
    marginBottom: '8px',
  },
  boldText: {
    fontWeight: 700,
    width: '100%',
    textAlign: 'center',
  },
  tableCellCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  demandPill: {
    height: '23px',
    padding: '0px 8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: '16px',
  },
  demandPillText: {
    color: theme.darkBlue,
  },
})

interface Props extends WithStyles<typeof styles> {
  demandedHardwarePerformanceList?: DemandedHardwarePerformance[]
}

const _DemandMonitorTable: FunctionComponent<Props> = ({ classes, demandedHardwarePerformanceList }) => {
  if (!demandedHardwarePerformanceList) {
    return null
  }

  const sortedDemandedHardwarePerformanceList = sortHardwareDemandPerformance(demandedHardwarePerformanceList)

  return (
    <div className={classes.tableWrapper}>
      <div className={classes.tableContent}>
        <table className={classes.table}>
          <tr className={classes.greenTableCell}>
            <th className={classes.tableCell}>
              <Text variant="baseXS">GPU</Text>
            </th>
            <th className={classes.tableCell}>
              <Text variant="baseXS">Recommended Specs</Text>
            </th>
            <th className={classes.tableCell}>
              <Text variant="baseXS">Demand</Text>
            </th>
            <th className={classes.tableCell}>
              <Text variant="baseXS">Average Earnings 24/h</Text>
            </th>
            <th className={classes.tableCell}>
              <Text variant="baseXS">Average Running Time 24/h</Text>
            </th>
          </tr>
          {sortedDemandedHardwarePerformanceList.map(({ name, earningRates, recommendedSpecs, utilizationPct }) => {
            const demand = getHardwareDemandLevel(utilizationPct)
            const avgEarningTimeHours = earningRates.avgEarningTimeMinutes / 60
            const avgRunningTime = Math.round(avgEarningTimeHours * 10) / 10

            return (
              <tr className={classes.tableRow}>
                <td className={classNames(classes.gpuWrapper, classes.tableCell, classes.greenTableCell)}>
                  <Text className={classes.gpuName} variant="baseS">
                    {name}
                  </Text>
                  <Text variant="baseXS">HOURLY RATE</Text>
                  <Text variant="baseXS">
                    {earningRates.minEarningRate}$ - {earningRates.maxEarningRate}$
                  </Text>
                </td>
                <td className={classes.tableCell}>
                  <div className={classes.tableCellCentered}>
                    <Text variant="baseXS">{recommendedSpecs.ramGb} GB System RAM</Text>
                    {/* <Text variant="baseXS">{recommendedSpecs.storage}</Text> */}
                  </div>
                </td>
                <td className={classes.tableCell}>
                  <div
                    className={classes.demandPill}
                    style={{
                      backgroundColor: demandPillColors[demand].background,
                      color: demandPillColors[demand].text,
                    }}
                  >
                    <Text variant="baseXS">{demand}</Text>
                  </div>
                </td>
                <td className={classes.tableCell}>
                  <div className={classes.tableCellCentered}>
                    <Text className={classes.boldText} variant="baseM">
                      {earningRates.avgEarning}$
                    </Text>
                  </div>
                </td>
                <td className={classes.tableCell}>
                  <div className={classes.tableCellCentered}>
                    <Text className={classes.boldText} variant="baseM">
                      {avgRunningTime} hours
                    </Text>
                  </div>
                </td>
              </tr>
            )
          })}
        </table>
      </div>
    </div>
  )
}

export const DemandMonitorTable = withStyles(styles)(_DemandMonitorTable)
