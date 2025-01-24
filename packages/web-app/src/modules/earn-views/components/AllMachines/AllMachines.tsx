import { faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Checkbox, Text } from '@saladtechnologies/garden-components'
import classNames from 'classnames'
import type CSS from 'csstype'
import { DateTime } from 'luxon'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Table } from '../../../../components/Table'
import type { TableRow } from '../../../../components/Table/types'
import { EarnSectionHeader } from '../EarnSectionHeader'
import { generatedMockedMachines } from './mocks'

const styles: () => Record<string, CSS.Properties> = () => ({
  allMachinesWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
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
    maxWidth: '700px',
  },
  tableCell: {
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
    padding: '10px',
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
  },
})

interface Props extends WithStyles<typeof styles> {}

const _AllMachines = ({ classes }: Props) => {
  const getTitles = () => {
    return [
      <div className={(classes.tableHeaderCell, classes.tableCellCentered)}>
        <FontAwesomeIcon icon={faList} />
      </div>,
      <div className={classes.tableHeaderCell}>
        <Text variant="baseXS">Machine ID</Text>
      </div>,
      <div className={classes.tableHeaderCell}>
        <Text variant="baseXS">Running Status</Text>
      </div>,
      <div className={classes.tableHeaderCell}>
        <Text variant="baseXS">Last Seen</Text>
      </div>,
      <div className={classNames(classes.tableHeaderCell, classes.tableCellCentered)}>
        <Text variant="baseXS">Current Earning Rate</Text>
      </div>,
      <div className={classNames(classes.tableHeaderCell, classes.tableCellCentered)}>
        <Text variant="baseXS">Warnings</Text>
      </div>,
    ]
  }

  const getRows = (): Array<TableRow> => {
    return generatedMockedMachines
      .map((machineRow) => {
        return {
          checkboxes: (
            <div className={classNames(classes.tableCell, classes.tableCellCentered)}>
              <Checkbox onChange={() => {}} checked={false} />
            </div>
          ),
          ...machineRow,
          lastSeen: DateTime.fromJSDate(machineRow.lastSeen).toFormat('MMM d, yyyy'),
          currentEarningRate: (
            <div className={classNames(classes.tableCell, classes.tableCellCentered)}>
              {machineRow.currentEarningRate}
            </div>
          ),
          warnings: (
            <div className={classes.warningPillWrapper}>
              {machineRow.warnings.map((warningText) => (
                <div className={classes.warningPill}>
                  <Text variant="baseXS">{warningText}</Text>
                </div>
              ))}
            </div>
          ),
        }
      })
      .map((machineRow) =>
        Object.values(machineRow).map((machineRowItem) => {
          return <div className={classes.tableCell}>{machineRowItem}</div>
        }),
      )
  }

  return (
    <div className={classes.allMachinesWrapper}>
      <EarnSectionHeader>All Machines</EarnSectionHeader>
      <div className={classes.tableWrapper}>
        <Table titles={getTitles()} rows={getRows()} />
      </div>
    </div>
  )
}

export const AllMachines = withStyles(styles)(_AllMachines)
