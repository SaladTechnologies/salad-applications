import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoadingSpinner, Text } from '@saladtechnologies/garden-components'
import classNames from 'classnames'
import type CSS from 'csstype'
import { useState, type FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import type { DemandedHardwarePerformance } from '../../DemandMonitorStore'
import { demandMonitorTableColumns, demandPillColors } from './constants'
import type { DemandMonitorTableColumn, DemandMonitorTableSort } from './types'
import { sortHardwareDemandPerformance } from './utils'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  tableWrapper: {
    fontFamily: theme.fontMallory,
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
    boxSizing: 'border-box',
    minWidth: '1000px',
  },
  table: {
    width: '100%',
    borderRadius: '6px',
    borderCollapse: 'collapse',
  },
  greenTableCellDivider: {
    backgroundColor: theme.darkBlue,
    width: '100%',
    height: '0.5px',
    marginBottom: '10px',
  },
  tableCell: {
    boxShadow: `inset 0px 0px 0px 0.5px ${theme.green}`,
    borderCollapse: 'collapse',
    padding: '10px 24px',
  },
  greenTableCell: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
    paddingTop: '0px',
    paddingLeft: '0px',
    paddingRight: '0px',
  },
  columnHeaderContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '8px',
  },
  columnHeaderWrapper: {
    cursor: 'pointer',
    paddingLeft: '0px',
    paddingRight: '0px',
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
  },
  gpuName: {
    fontWeight: 700,
  },
  cellHeaderWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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

const _DemandMonitorTable: FunctionComponent<Props> = ({ classes, demandedHardwarePerformanceList }) => {
  const [tableSort, setTableSort] = useState<DemandMonitorTableSort>({
    columnKey: 'demand',
    sortOrder: 'descending',
  })

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
    if (tableSort.columnKey === columnKey) {
      setTableSort({ columnKey, sortOrder: tableSort.sortOrder === 'descending' ? 'ascending' : 'descending' })
    } else {
      setTableSort({ columnKey, sortOrder: 'descending' })
    }
  }

  const sortedDemandedHardwarePerformanceList = sortHardwareDemandPerformance({
    demandedHardwarePerformanceList,
    sortRule: demandMonitorTableColumns[tableSort.columnKey].sortRule,
    sortOrder: tableSort.sortOrder,
  })

  return (
    <div className={classes.tableWrapper}>
      <div className={classes.tableContent}>
        <table className={classes.table}>
          <thead>
            <tr className={classes.greenTableCell}>
              {Object.values(demandMonitorTableColumns).map(({ displayName, key }) => {
                const isTableSortedByColumn = key === tableSort.columnKey
                const isSortedAscending = tableSort.sortOrder === 'ascending'
                return (
                  <th
                    className={classNames(classes.tableCell, classes.columnHeaderWrapper)}
                    onClick={() => handleColumnHeaderClick(key)}
                    key={key}
                  >
                    <div className={classes.columnHeaderContent}>
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
          </thead>
          <tbody>
            {sortedDemandedHardwarePerformanceList.map(
              ({ displayName, earningRates, recommendedSpecs, demandTierName, variantNames }) => {
                return (
                  <tr key={displayName}>
                    <td className={classNames(classes.gpuWrapper, classes.tableCell, classes.greenTableCell)}>
                      <div className={classes.greenTableCellDivider}></div>
                      <div className={classes.cellHeaderWrapper}>
                        <Text className={classes.gpuName} variant="baseS">
                          {displayName}
                        </Text>
                        {variantNames.length > 0 && <Text variant="baseXS">(Incl. Super Variant)</Text>}
                      </div>
                      <Text variant="baseXS">HOURLY RATE</Text>
                      <Text variant="baseXS">
                        ${earningRates.minEarningRate} - ${earningRates.maxEarningRate}
                      </Text>
                    </td>
                    <td className={classes.tableCell}>
                      <div className={classes.tableCellCentered}>
                        <Text variant="baseXS">{recommendedSpecs.ramGb} GB System RAM</Text>
                        <Text variant="baseXS">500 GB Storage</Text>
                      </div>
                    </td>
                    <td className={classes.tableCell}>
                      <div
                        className={classes.demandPill}
                        style={{
                          backgroundColor: demandPillColors[demandTierName].background,
                          color: demandPillColors[demandTierName].text,
                        }}
                      >
                        <Text variant="baseXS">{demandTierName}</Text>
                      </div>
                    </td>
                    <td className={classes.tableCell}>
                      <div className={classes.tableCellCentered}>
                        <Text className={classes.boldText} variant="baseM">
                          ${earningRates.avgEarningRate?.toFixed(3)}
                        </Text>
                      </div>
                    </td>
                    <td className={classes.tableCell}>
                      <div className={classes.tableCellCentered}>
                        <Text className={classes.boldText} variant="baseM">
                          ${earningRates.top25PctEarningRate?.toFixed(3)}
                        </Text>
                      </div>
                    </td>
                  </tr>
                )
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const DemandMonitorTable = withStyles(styles)(_DemandMonitorTable)
