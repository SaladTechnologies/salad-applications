import { Button, ButtonGroup, Text } from '@saladtechnologies/garden-components'
import { useIntl } from 'react-intl'
import withStyles, { WithStyles } from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  panel: {
    color: theme.darkBlue,
  },
  title: {
    '@media (max-width: 599px)': {
      fontSize: 32,
    },
  },
  titleContainer: {
    alignItems: 'center',
    color: theme.lightGreen,
    display: 'flex',
    marginBottom: 24,
  },
  intervalEarnings: {
    '@media (min-width: 600px)': {
      marginBottom: 2,
      marginLeft: 8,
    },
  },
  intervalEarningsText: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 24,
    '@media (min-width: 900px)': {
      alignItems: 'flex-end',
      flexDirection: 'row',
      marginTop: 0,
      paddingLeft: 24,
    },
  },
  intervalPanel: {
    display: 'flex',
    flexDirection: 'column',
    '@media (min-width: 900px)': {
      flexDirection: 'row',
    },
  },
})

export interface EarningChartPanelProps extends WithStyles<typeof styles> {
  intervalEarnings: number
  daysShowing: 1 | 7 | 30
  title: string
  viewLast24Hours: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
}

const _EarningChartPanel = ({
  classes,
  intervalEarnings,
  daysShowing,
  title,
  viewLast24Hours,
  viewLast7Days,
  viewLast30Days,
}: EarningChartPanelProps) => {
  const intl = useIntl()
  const formattedIntervalEarnings = `${intl.formatNumber(intervalEarnings, {
    style: 'decimal',
    minimumFractionDigits: 5,
  })}`

  const intervalLabel = daysShowing === 1 ? '24 Hours' : daysShowing === 7 ? '7 Days' : '30 Days'
  return (
    <div className={classes.panel}>
      <div className={classes.titleContainer}>
        <Text variant="base3XL">
          <span className={classes.title}>{title}</span>
        </Text>
      </div>
      <div className={classes.intervalPanel}>
        {/* @ts-ignore - Need to fix props in Garden component */}
        <ButtonGroup>
          <Button
            variant={daysShowing === 1 ? 'primary-basic' : 'outlined'}
            size="small"
            label="24 Hours"
            onClick={viewLast24Hours}
          />
          <Button
            variant={daysShowing === 7 ? 'primary-basic' : 'outlined'}
            size="small"
            label="7 Days"
            onClick={viewLast7Days}
          />
          <Button
            variant={daysShowing === 30 ? 'primary-basic' : 'outlined'}
            size="small"
            label="30 Days"
            onClick={viewLast30Days}
          />
        </ButtonGroup>
        {intervalEarnings > 0 && (
          <div className={classes.intervalEarningsText}>
            <Text variant="baseXXL">${formattedIntervalEarnings}</Text>
            <span className={classes.intervalEarnings}>
              <Text variant="baseL">Earned in the last {intervalLabel}</Text>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export const EarningChartPanel = withStyles(styles)(_EarningChartPanel)
