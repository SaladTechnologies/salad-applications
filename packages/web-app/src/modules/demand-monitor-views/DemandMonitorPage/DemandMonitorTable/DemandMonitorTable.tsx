import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoadingSpinner, Text } from '@saladtechnologies/garden-components'
import classNames from 'classnames'
import type CSS from 'csstype'
import { toJS } from 'mobx'
import { useState, type FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import type { DemandedHardwarePerformance } from '../../DemandMonitorStore'
import type { DemandMonitorTableColumn } from './constants'
import { demandMonitorTableColumns, demandPillColors } from './constants'
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
    minWidth: '1100px',
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
  columnHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '8px',
  },
  clickable: {
    cursor: 'pointer',
  },
  sortOrderIconWrapper: {
    position: 'relative',
    height: '100%',
    width: '5px',
  },
  sortOrderIconDown: {
    position: 'relative',
    top: '-4px',
  },
  sortOrderIconUp: {
    position: 'relative',
    top: '5px',
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
  loadingSpinnerWrap: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '64px',
    marginBottom: '64px',
  },
})

interface Props extends WithStyles<typeof styles> {
  demandedHardwarePerformanceList?: DemandedHardwarePerformance[]
}

interface DemandMonitorTableSortOrder {
  columnKey: DemandMonitorTableColumn['key']
  sorted: 'ascending' | 'descending' | 'none'
}

const _DemandMonitorTable: FunctionComponent<Props> = ({ classes, demandedHardwarePerformanceList }) => {
  const [sortOrder, setSortOrder] = useState<DemandMonitorTableSortOrder>({ columnKey: 'demand', sorted: 'descending' })

  if (!demandedHardwarePerformanceList) {
    return (
      !demandedHardwarePerformanceList && (
        <div className={classes.loadingSpinnerWrap}>
          <LoadingSpinner variant="light" size={100} />
        </div>
      )
    )
  }

  const handleColumnHeaderClick = (columnKey: DemandMonitorTableColumn['key']) => {
    if (sortOrder.columnKey === columnKey) {
      setSortOrder({ columnKey, sorted: sortOrder.sorted === 'descending' ? 'ascending' : 'descending' })
    } else {
      setSortOrder({ columnKey, sorted: 'descending' })
    }
  }

  let sortedDemandedHardwarePerformanceList = sortHardwareDemandPerformance(
    toJS(demandedHardwarePerformanceList),
    demandMonitorTableColumns[sortOrder.columnKey].sortRule,
  )

  if (sortOrder.sorted === 'ascending') {
    sortedDemandedHardwarePerformanceList = sortedDemandedHardwarePerformanceList.reverse()
  }

  return (
    <div className={classes.tableWrapper}>
      <div className={classes.tableContent}>
        <table className={classes.table}>
          <tr className={classes.greenTableCell}>
            {Object.values(demandMonitorTableColumns).map(({ displayName, key }) => {
              const isTableSortedByColumn = key === sortOrder.columnKey
              const isSortedAscending = sortOrder.sorted === 'ascending'
              return (
                <th
                  className={classNames(classes.tableCell, classes.clickable)}
                  onClick={() => handleColumnHeaderClick(key)}
                >
                  <div className={classes.columnHeader}>
                    <Text variant="baseXS">{displayName}</Text>
                    <div className={classes.sortOrderIconWrapper}>
                      {isTableSortedByColumn && (
                        <FontAwesomeIcon
                          className={isSortedAscending ? classes.sortOrderIconUp : classes.sortOrderIconDown}
                          icon={isSortedAscending ? faSortUp : faSortDown}
                        />
                      )}
                    </div>
                  </div>
                </th>
              )
            })}
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
                    ${earningRates.minEarningRate} - ${earningRates.maxEarningRate}
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
                      ${earningRates.avgEarning}
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
