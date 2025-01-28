import { faCircleQuestion, faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Checkbox, Text } from '@saladtechnologies/garden-components'
import classNames from 'classnames'
import type CSS from 'csstype'
import { DateTime } from 'luxon'
import { useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Table } from '../../../../components/Table'
import type { TableRow } from '../../../../components/Table/types'
import { DefaultTheme, type SaladTheme } from '../../../../SaladTheme'
import { EarnSectionHeader } from '../EarnSectionHeader'
import { generatedMockedMachines } from './mocks'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
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

interface Props extends WithStyles<typeof styles> {}

const _AllMachines = ({ classes }: Props) => {
  const [selectedMachineIds, setSelectedMachineIds] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(generatedMockedMachines.map((machine) => [machine.id, false])),
  )

  const handleMachineIdQuestionIconClick = () => {
    window.location.href = 'https://support.salad.com/article/414-how-to-find-your-salad-machine-id'
  }

  const getTitles = () => {
    return [
      <div className={(classes.tableHeaderCell, classes.tableCellCentered)}>
        <FontAwesomeIcon icon={faList} />
      </div>,
      <div className={classes.tableHeaderCell}>
        <Text variant="baseXS">Machine ID</Text>
        <div className={classes.questionIconWrapper} onClick={handleMachineIdQuestionIconClick}>
          <FontAwesomeIcon
            size="sm"
            icon={faCircleQuestion}
            fill={DefaultTheme.darkBlue}
            color={DefaultTheme.darkBlue}
          />
        </div>
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
      .map((machine) => {
        return {
          checkbox: (
            <div className={classNames(classes.tableCell, classes.tableCellCentered)}>
              <div className={classes.checkboxWrapper}>
                <Checkbox
                  onChange={(checked) =>
                    setSelectedMachineIds((previousSelectedMachineIds) => ({
                      ...previousSelectedMachineIds,
                      [machine.id]: checked,
                    }))
                  }
                  checked={selectedMachineIds[machine.id]}
                />
              </div>
            </div>
          ),
          ...machine,
          lastSeen: DateTime.fromJSDate(machine.lastSeen).toFormat('MMM d, yyyy'),
          currentEarningRate: (
            <div className={classNames(classes.tableCell, classes.tableCellCentered)}>{machine.currentEarningRate}</div>
          ),
          warnings: (
            <div className={classes.warningPillWrapper}>
              {machine.warnings.map((warningText) => (
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
