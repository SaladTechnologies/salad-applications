import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { type FunctionComponent } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../SaladTheme'
import type { TableRow, TableTitles } from './types'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  tableWrapper: {
    fontFamily: theme.fontMallory,
    color: theme.lightGreen,
    fontSize: '14px',
    width: '100%',
    height: '100%',
    paddingBottom: '14px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    borderBottom: `1px #3B4D5C solid`,
  },
  tableRow: {
    borderBottom: `1px #3B4D5C solid`,
  },
  tableCell: {},
})

interface Props extends WithStyles<typeof styles> {
  titles: TableTitles
  rows: Array<TableRow>
  autoHeightMax?: number | string
}

const _Table: FunctionComponent<Props> = ({ classes, titles, rows, autoHeightMax = '100%' }) => {
  return (
    <Scrollbars style={{ width: '100%' }} autoHeight autoHeightMax={autoHeightMax}>
      <div className={classes.tableWrapper}>
        <table className={classes.table}>
          <thead>
            <tr className={classes.tableHeaderRow}>
              {titles.map((title, index) => {
                const titleJSX = typeof title === 'object' ? title : <Text variant="baseXS">{title}</Text>
                return (
                  <th className={classes.tableCell} key={index}>
                    {titleJSX}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              return (
                <tr key={index} className={classes.tableRow}>
                  {row.map((rowItem) => {
                    const rowItemJSX =
                      typeof rowItem === 'object' ? rowItem : <Text variant="baseXS">{rowItem.toString()}</Text>
                    return <td className={classes.tableCell}>{rowItemJSX}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Scrollbars>
  )
}

export const Table = withStyles(styles)(_Table)
