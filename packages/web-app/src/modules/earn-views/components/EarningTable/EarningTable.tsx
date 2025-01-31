import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useEffect } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { Machine } from '../../../../api/machinesApiClient/generated/models'
import { Pagination } from '../../../../components/Pagination'
import { usePagination } from '../../../../components/Pagination/usePagination'
import { Table } from '../../../../components/Table'
import type { TableRow } from '../../../../components/Table/types'
import { type SaladTheme } from '../../../../SaladTheme'
import type { ChartDaysShowing, EarningPerMachine } from '../../../balance/models'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  earningTableWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    height: '500px',
    width: '500px',
    position: 'relative',
  },
  tableWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative',
    height: '200px',
    width: '100%',
    maxWidth: '700px',
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
  machines: Machine[] | null
  daysShowing: ChartDaysShowing
  fetchEarningsPerMachine: () => void
}

const _EarningTable = ({ classes, machines, earningsPerMachine, daysShowing, fetchEarningsPerMachine }: Props) => {
  const {
    lowestItemNumberOnPage,
    highestItemNumberOnPage,
    currentPageNumber,
    itemsPerPageAmount,
    setCurrentPageNumber,
  } = usePagination()

  console.log('daysShowing ===> ', daysShowing)
  console.log('earningsPerMachine ===> ', earningsPerMachine)

  useEffect(() => {
    fetchEarningsPerMachine()
  }, [fetchEarningsPerMachine])

  const getTitles = () => {
    return [
      <div className={classes.tableHeaderCell}>
        <Text variant="baseXS">Machine ID</Text>
      </div>,
      <div className={classes.tableHeaderCell}>
        <Text variant="baseXS">Average</Text>
      </div>,
    ]
  }

  if (!machines) {
    return
  }

  const getRows = (): Array<TableRow> => {
    return machines
      .filter((machine) => machine.machine_id)
      .filter((_machine, index) => {
        const itemNumber = index + 1
        return itemNumber >= lowestItemNumberOnPage && itemNumber <= highestItemNumberOnPage
      })
      .map((machine) => {
        const machineEarnings = earningsPerMachine[machine.machine_id!.toString()]

        if (!machineEarnings?.length) {
          return {
            id: machine.machine_id?.toString().substring(0, 8),
            averageEarnings: '-',
          }
        }

        const earningsSum = machine.machine_id ? machineEarnings?.reduce((sum, item) => item.earnings + sum, 0) : 0

        const averageEarnings = earningsSum / machineEarnings?.length

        return {
          id: machine.machine_id?.toString().substring(0, 8),
          averageEarnings: `$${averageEarnings.toFixed(2)}`,
        }
      })
      .map((machineRow) =>
        Object.values(machineRow).map((machineRowItem) => {
          return <div className={classes.tableCell}>{machineRowItem}</div>
        }),
      )
  }

  return (
    <div className={classes.earningTableWrapper}>
      <div className={classes.tableWrapper}>
        <Table titles={getTitles()} rows={getRows()} />
        <Pagination
          itemsTotalAmount={machines.length}
          itemsPerPageAmount={itemsPerPageAmount}
          currentPageNumber={currentPageNumber}
          onPageChange={(pageNumber: number) => setCurrentPageNumber(pageNumber)}
        />
      </div>
    </div>
  )
}

export const EarningTable = withStyles(styles)(_EarningTable)
