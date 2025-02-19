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
  daysShowing: ChartDaysShowing
}

const _EarningTable = ({ classes, earningsPerMachine, daysShowing }: Props) => {
  const {
    lowestItemNumberOnPage,
    highestItemNumberOnPage,
    currentPageNumber,
    itemsPerPageAmount,
    setCurrentPageNumber,
  } = usePagination()

  console.log('daysShowing ===> ', daysShowing)
  console.log('earningsPerMachine ===> ', earningsPerMachine)

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

  const machineIds = Object.keys(earningsPerMachine)
  if (!machineIds) {
    return
  }

  const getRows = (): Array<TableRow> => {
    return machineIds
      .filter((_machineId, index) => {
        const itemNumber = index + 1
        return itemNumber >= lowestItemNumberOnPage && itemNumber <= highestItemNumberOnPage
      })
      .map((machineId) => {
        const machineEarnings = earningsPerMachine[machineId]

        if (!machineEarnings?.length) {
          return {
            id: machineId.substring(0, 8),
            averageEarnings: '-',
          }
        }

        const earningsSum = machineId ? machineEarnings?.reduce((sum, item) => item.earnings + sum, 0) : 0

        const averageEarnings = earningsSum / machineEarnings?.length

        return {
          id: machineId.substring(0, 8),
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
          itemsTotalAmount={machineIds.length}
          itemsPerPageAmount={itemsPerPageAmount}
          currentPageNumber={currentPageNumber}
          onPageChange={(pageNumber: number) => setCurrentPageNumber(pageNumber)}
        />
      </div>
    </div>
  )
}

export const EarningTable = withStyles(styles)(_EarningTable)
