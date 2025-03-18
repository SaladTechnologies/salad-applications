import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Pagination } from '../../../../components/Pagination'
import { usePagination } from '../../../../components/Pagination/usePagination'
import { Table } from '../../../../components/Table'
import type { TableRow } from '../../../../components/Table/types'
import { type SaladTheme } from '../../../../SaladTheme'
import type { ChartDaysShowing, EarningPerMachine } from '../../../balance/models'
import { ViewData } from '../EarningHistory/constants'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  earningTableWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    height: '500px',
    width: '100%',
    position: 'relative',
  },
  tableWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative',
    height: '200px',
    width: '100%',
  },
  tableCell: {
    padding: '4px',
    fontSize: '14px',
  },
  tableHeaderCell: {
    padding: '10px',
    paddingLeft: '0px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '85px',
  },
  tableCellCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  warningPillWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '6px',
  },
  warningPill: {
    height: '23px',
    padding: '0px 8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: '16px',
    backgroundColor: '#F6931D',
    width: 'auto',
    color: theme.darkBlue,
    textDecoration: 'underline',
  },
  checkboxWrapper: {
    width: '22px',
    height: '22px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    border: `1px ${theme.lightGreen} solid`,
    transform: 'scale(0.8)',
  },
  noDataWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: theme.lightGreen,
  },
  questionIconWrapper: {
    marginLeft: '6px',
    backgroundColor: theme.lightGreen,
    border: `.5px solid ${theme.lightGreen}`,
    borderRadius: '100%',
    width: '13px',
    height: '13px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    cursor: 'pointer',
  },
})

interface Props extends WithStyles<typeof styles> {
  earningsPerMachine: EarningPerMachine
  daysShowing: ChartDaysShowing
  viewData: ViewData
}

const _EarningTable = ({ classes, earningsPerMachine, daysShowing, viewData }: Props) => {
  const {
    lowestItemNumberOnPage,
    highestItemNumberOnPage,
    currentPageNumber,
    itemsPerPageAmount,
    setCurrentPageNumber,
  } = usePagination()

  const isIndividualViewData = viewData === ViewData.Individual

  const firstMachineEarnings = Object.values(earningsPerMachine)[0]

  const getTitles = () => {
    const earningTimeFrames: Array<string> = firstMachineEarnings
      ? firstMachineEarnings?.map((earningTimeFrame) =>
          daysShowing === 1
            ? earningTimeFrame.timestamp.format('MMM D, h A')
            : earningTimeFrame.timestamp.format('MMM D'),
        )
      : []

    return [
      <div className={classes.tableHeaderCell}>
        <Text variant="baseXS">{isIndividualViewData ? 'Machine ID' : 'Machines'}</Text>
      </div>,
      <div className={classes.tableHeaderCell}>
        <Text variant="baseXS">Average</Text>
      </div>,
      ...earningTimeFrames.map((timeFrame) => (
        <div className={classes.tableHeaderCell}>
          <Text variant="baseXS">{timeFrame}</Text>
        </div>
      )),
    ]
  }

  const machineIds = Object.keys(earningsPerMachine)

  if (machineIds.length < 1) {
    return (
      <div className={classes.noDataWrapper}>
        <Text variant="baseM">No data to display</Text>
      </div>
    )
  }

  const getIndividualRowsData = (): Array<TableRow> => {
    return machineIds
      .filter((_machineId, index) => {
        const itemNumber = index + 1
        return itemNumber >= lowestItemNumberOnPage && itemNumber <= highestItemNumberOnPage
      })
      .map((machineId) => {
        const machineEarningTimeFrames = earningsPerMachine[machineId]

        if (!machineEarningTimeFrames?.length) {
          return {
            id: machineId.substring(0, 8),
            averageEarnings: '-',
          }
        }

        const machineEarningsTotal = machineId
          ? machineEarningTimeFrames?.reduce((sum, item) => item.earnings + sum, 0)
          : 0

        const averageEarnings = machineEarningsTotal / machineEarningTimeFrames?.length

        const machineEarningsPerTimeFrame = earningsPerMachine[machineId]
          ? Object.values(earningsPerMachine[machineId]).map((machineEarning) => [
              machineEarning.timestamp.toString(),
              `$${machineEarning.earnings.toFixed(2)}`,
            ])
          : []

        return {
          id: machineId.substring(0, 8),
          averageEarnings: `$${averageEarnings.toFixed(2)}`,
          ...Object.fromEntries(machineEarningsPerTimeFrame),
        }
      })
  }

  const individualRows = getIndividualRowsData().map((machineRow) =>
    Object.values(machineRow).map((machineRowItem) => {
      return <div className={classes.tableCell}>{machineRowItem as string}</div>
    }),
  )

  const aggregatedRowData: number[] = firstMachineEarnings
    ? Object.values(earningsPerMachine).reduce((aggregatedEarning, earningPerMachine) => {
        return aggregatedEarning.map((rowItem, index) => {
          if (earningPerMachine && earningPerMachine[index]) {
            return (rowItem as number) + (earningPerMachine[index].earnings as number)
          }
          return rowItem
        })
      }, Array(firstMachineEarnings.length).fill(0))
    : []

  const averageAggregatedEarning =
    aggregatedRowData.reduce((sum, earningPerFrame) => earningPerFrame + sum, 0) / aggregatedRowData.length
  const aggregatedRow = [
    <div className={classes.tableCell}>{machineIds.length}</div>,
    <div className={classes.tableCell}>{`$${averageAggregatedEarning.toFixed(2)} `}</div>,
    ...aggregatedRowData.map((aggregatedRowItem) => (
      <div className={classes.tableCell}>{`$${(aggregatedRowItem as number).toFixed(2)}`}</div>
    )),
  ]

  return (
    <div className={classes.earningTableWrapper}>
      <div className={classes.tableWrapper}>
        <Table
          titles={getTitles()}
          rows={isIndividualViewData ? individualRows : [aggregatedRow]}
          autoHeightMax={260}
        />
        <Pagination
          itemsTotalAmount={isIndividualViewData ? machineIds.length : 1}
          itemsPerPageAmount={isIndividualViewData ? itemsPerPageAmount : 1}
          currentPageNumber={isIndividualViewData ? currentPageNumber : 1}
          onPageChange={(pageNumber: number) => setCurrentPageNumber(pageNumber)}
        />
      </div>
    </div>
  )
}

export const EarningTable = withStyles(styles)(_EarningTable)
