import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { type FunctionComponent } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { useMediaQuery } from 'react-responsive'
import { DefaultTheme, type SaladTheme } from '../../SaladTheme'
import { mobileSize } from '../DeviceTypes'
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
  trackBackgroundColor?: string
}

const _Table: FunctionComponent<Props> = ({
  classes,
  titles,
  rows,
  autoHeightMax = '100%',
  trackBackgroundColor = DefaultTheme.darkBlue,
}) => {
  const renderThumb: React.ComponentType<any> = ({ style, ...props }) => {
    return (
      <div
        style={{ ...style, backgroundColor: DefaultTheme.lightGreen, borderRadius: 8, cursor: 'pointer ' }}
        {...props}
      />
    )
  }

  const renderHorizontalTrack: React.ComponentType<any> = ({ style, ...props }) => {
    return (
      <div
        style={{
          position: 'absolute',
          height: '18px',
          right: '0px',
          left: '0px',
          bottom: '0px',
          paddingTop: '6px',
          paddingBottom: '6px',
          paddingRight: '18px',
          boxSizing: 'border-box',
          backgroundColor: trackBackgroundColor,
        }}
        {...props}
      />
    )
  }

  const renderVerticalTrack: React.ComponentType<any> = ({ style, ...props }) => {
    return (
      <div
        style={{
          position: 'absolute',
          width: '18px',
          right: '0px',
          bottom: '0px',
          paddingBottom: '18px',
          top: '0px',
          paddingRight: '6px',
          paddingLeft: '6px',
          boxSizing: 'border-box',
          backgroundColor: trackBackgroundColor,
        }}
        {...props}
      />
    )
  }

  const isMobile = useMediaQuery({ query: `(max-width: ${mobileSize}px)` })

  return (
    <Scrollbars
      style={{ width: '100%' }}
      renderTrackHorizontal={isMobile ? undefined : renderHorizontalTrack}
      renderTrackVertical={isMobile ? undefined : renderVerticalTrack}
      renderThumbHorizontal={isMobile ? undefined : renderThumb}
      renderThumbVertical={isMobile ? undefined : renderThumb}
      autoHeight
      autoHeightMax={autoHeightMax}
    >
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
                  {row.map((rowItem, index) => {
                    const rowItemJSX =
                      typeof rowItem === 'object' ? rowItem : <Text variant="baseXS">{rowItem.toString()}</Text>
                    return (
                      <td className={classes.tableCell} key={index}>
                        {rowItemJSX}
                      </td>
                    )
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
