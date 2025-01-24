import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { type FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../SaladTheme'
import type { TableContent } from './types'

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
    boxSizing: 'border-box',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    borderBottom: `1px ${theme.lightGreen} solid`,
  },
  tableRow: {
    borderBottom: `1px ${theme.lightGreen} solid`,
  },
  tableCell: {},
})

interface Props extends WithStyles<typeof styles> {
  tableContent: TableContent
}

const _Table: FunctionComponent<Props> = ({ classes, tableContent }) => {
  return (
    <div className={classes.tableWrapper}>
      <div className={classes.tableContent}>
        <table className={classes.table}>
          <thead>
            <tr className={classes.tableHeaderRow}>
              {tableContent.titles.map((title) => {
                const titleJSX = typeof title === 'object' ? title : <Text variant="baseXS">{title}</Text>
                return (
                  <th className={classes.tableCell} key={title.toString()}>
                    {titleJSX}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {tableContent.rows.map((row, index) => {
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
    </div>
  )
}

export const Table = withStyles(styles)(_Table)
