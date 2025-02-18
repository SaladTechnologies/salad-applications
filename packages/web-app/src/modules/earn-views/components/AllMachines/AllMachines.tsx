import { faCircleQuestion, faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Checkbox, Text } from '@saladtechnologies/garden-components'
import classNames from 'classnames'
import type CSS from 'csstype'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { DropdownOption } from '../../../../components/Dropdown'
import { Dropdown } from '../../../../components/Dropdown'
import { Pagination } from '../../../../components/Pagination'
import { usePagination } from '../../../../components/Pagination/usePagination'
import { Table } from '../../../../components/Table'
import type { TableRow } from '../../../../components/Table/types'
import { DefaultTheme, type SaladTheme } from '../../../../SaladTheme'
import { EarnSectionHeader } from '../EarnSectionHeader'
import type { MachineDetails } from './utils'

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
    position: 'relative',
    padding: '10px',
    paddingLeft: '10px',
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
  idWrapper: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  selectItemsDropdownWrap: {
    position: 'absolute',
    left: '10px',
    top: '32px',
    zIndex: 1,
  },
})

interface Props extends WithStyles<typeof styles> {
  machineDetailsList: MachineDetails[]
  onMachineIdClick: (machineId: string) => void
  onSelectedMachineIdsChange: (machineIds: string[]) => void
}

const _AllMachines = ({ classes, machineDetailsList, onMachineIdClick, onSelectedMachineIdsChange }: Props) => {
  const [selectedMachinesById, setSelectedMachinesById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(machineDetailsList.map((machine) => [machine.id, false])),
  )

  useEffect(() => {
    onSelectedMachineIdsChange(Object.keys(selectedMachinesById).filter((machineId) => selectedMachinesById[machineId]))
  }, [onSelectedMachineIdsChange, selectedMachinesById])

  const handleMachineIdQuestionIconClick = () => {
    window.location.href = 'https://support.salad.com/article/414-how-to-find-your-salad-machine-id'
  }

  const {
    lowestItemNumberOnPage,
    highestItemNumberOnPage,
    currentPageNumber,
    itemsPerPageAmount,
    setCurrentPageNumber,
  } = usePagination()

  const dropdownOptions: DropdownOption<unknown>[] = [
    {
      displayName: 'Select All',
      handler: () =>
        setSelectedMachinesById(machineDetailsList.reduce((acc, machine) => ({ ...acc, [machine.id]: true }), {})),
    },
    {
      displayName: 'Select All in Page',
      handler: () => {
        const updatedSelectedMachinesById = machineDetailsList
          .slice(lowestItemNumberOnPage - 1, highestItemNumberOnPage)
          .reduce((acc, machine) => ({ ...acc, [machine.id]: true }), {})

        setSelectedMachinesById((previousSelectedMachinesById) => ({
          ...previousSelectedMachinesById,
          ...updatedSelectedMachinesById,
        }))
      },
    },
    {
      displayName: 'Deselect All',
      handler: () => setSelectedMachinesById({}),
    },
    {
      displayName: 'Deselect All in Page',
      handler: () => {
        const updatedUnselectedMachinesById = machineDetailsList
          .slice(lowestItemNumberOnPage - 1, highestItemNumberOnPage)
          .reduce((acc, machine) => ({ ...acc, [machine.id]: false }), {})

        setSelectedMachinesById((previousSelectedMachineIds) => ({
          ...previousSelectedMachineIds,
          ...updatedUnselectedMachinesById,
        }))
      },
    },
  ]

  const getTitles = () => {
    return [
      <div className={(classes.tableHeaderCell, classes.tableCellCentered)}>
        <Dropdown
          options={dropdownOptions}
          optionKey="displayName"
          wrapClassname={classes.selectItemsDropdownWrap}
          toggleContent={<FontAwesomeIcon icon={faList} />}
        />
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
        <Text variant="baseXS">Last Seen</Text>
      </div>,
      <div className={classNames(classes.tableHeaderCell, classes.tableCellCentered)}>
        <Text variant="baseXS">Current Earning Rate</Text>
      </div>,
    ]
  }

  const getRows = (): Array<TableRow> => {
    return machineDetailsList
      .filter((_machine, index) => {
        const itemNumber = index + 1
        return itemNumber >= lowestItemNumberOnPage && itemNumber <= highestItemNumberOnPage
      })
      .map((machine) => {
        return {
          checkbox: (
            <div className={classNames(classes.tableCell, classes.tableCellCentered)}>
              <div className={classes.checkboxWrapper}>
                <Checkbox
                  onChange={(checked) =>
                    setSelectedMachinesById((previousSelectedMachineIds) => ({
                      ...previousSelectedMachineIds,
                      [machine.id]: checked,
                    }))
                  }
                  checked={selectedMachinesById[machine.id]}
                />
              </div>
            </div>
          ),
          id: (
            <div
              className={classNames(classes.tableCell, classes.idWrapper)}
              onClick={() => onMachineIdClick(machine.id)}
            >
              <Text variant="baseS">{machine.id.substring(0, 8)}</Text>
            </div>
          ),
          lastSeen: machine.lastSeen ? DateTime.fromJSDate(machine.lastSeen).toRelative() : 'N/A',
          currentHourlyEarningRate: (
            <div className={classNames(classes.tableCell, classes.tableCellCentered)}>
              {machine.currentHourlyEarningRate ? `$${machine.currentHourlyEarningRate.toFixed(3)} / Hour` : 'N/A'}
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
        <Pagination
          itemsTotalAmount={machineDetailsList.length}
          itemsPerPageAmount={itemsPerPageAmount}
          currentPageNumber={currentPageNumber}
          onPageChange={(pageNumber: number) => setCurrentPageNumber(pageNumber)}
        />
      </div>
    </div>
  )
}

export const AllMachines = withStyles(styles)(_AllMachines)
