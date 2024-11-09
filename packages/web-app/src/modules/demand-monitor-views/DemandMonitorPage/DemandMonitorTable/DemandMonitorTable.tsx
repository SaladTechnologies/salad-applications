import { Text } from '@saladtechnologies/garden-components'
import classNames from 'classnames'
import type CSS from 'csstype'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { demandPillColors } from './constants'
import { mockedDemandMonitorData } from './mocks'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  tableWrapper: {
    fontFamily: 'Mallory',
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
    minWidth: '900px',
    '@media (max-width: 900px)': {
      minWidth: '1000px',
    },
  },
  table: {
    width: '100%',
    borderRadius: '6px',
    borderCollapse: 'collapse',
    boxSizing: 'border-box',
  },
  greenTableCell: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
  },
  tableCell: {
    border: `1px ${theme.green} solid`,
    borderCollapse: 'collapse',
    padding: '10px 24px',
  },
  gpuWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderTop: `1px ${theme.darkBlue} solid`,
  },
  gpuName: {
    fontWeight: 700,
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
})

interface Props extends WithStyles<typeof styles> {}

const _DemandMonitorTable: FunctionComponent<Props> = ({ classes }) => {
  return (
    <div className={classes.tableWrapper}>
      <div className={classes.tableContent}>
        <table className={classes.table}>
          <tr className={classes.greenTableCell}>
            <th className={classes.tableCell}>
              <Text variant="baseXS">GPU</Text>
            </th>
            <th className={classes.tableCell}>
              <Text variant="baseXS">Recommended Specs</Text>
            </th>
            <th className={classes.tableCell}>
              <Text variant="baseXS">Demand</Text>
            </th>
            <th className={classes.tableCell}>
              <Text variant="baseXS">Average Earnings 24/h</Text>
            </th>
            <th className={classes.tableCell}>
              <Text variant="baseXS">Average Running Time 24/h</Text>
            </th>
          </tr>
          {mockedDemandMonitorData.map(({ gpu, hourlyRate, recommendedSpecs, demand, avgEarnings, avgRunningTime }) => (
            <tr>
              <td className={classNames(classes.gpuWrapper, classes.tableCell, classes.greenTableCell)}>
                <Text className={classes.gpuName} variant="baseS">
                  {gpu}
                </Text>
                <Text variant="baseXS">HOURLY RATE</Text>
                <Text variant="baseXS">{hourlyRate}</Text>
              </td>
              <td className={classes.tableCell}>
                <div className={classes.tableCellCentered}>
                  <Text variant="baseXS">{recommendedSpecs.ram}</Text>
                  <Text variant="baseXS">{recommendedSpecs.storage}</Text>
                </div>
              </td>
              <td className={classes.tableCell}>
                <div
                  className={classes.demandPill}
                  style={{
                    backgroundColor: demandPillColors[demand].background,
                    color: demandPillColors[demand].text,
                  }}
                >
                  <Text variant="baseXS">{demand}</Text>
                </div>
              </td>
              <td className={classes.tableCell}>
                <div className={classes.tableCellCentered}>
                  <Text className={classes.boldText} variant="baseM">
                    {avgEarnings}
                  </Text>
                </div>
              </td>
              <td className={classes.tableCell}>
                <div className={classes.tableCellCentered}>
                  <Text className={classes.boldText} variant="baseM">
                    {avgRunningTime}
                  </Text>
                </div>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  )
}

export const DemandMonitorTable = withStyles(styles)(_DemandMonitorTable)
