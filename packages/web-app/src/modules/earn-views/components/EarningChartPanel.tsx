import { Button, Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  titleContainer: {
    alignItems: 'center',
    color: theme.lightGreen,
    display: 'flex',
  },
  bonusRateText: {
    paddingLeft: 15,
  },
  buttons: {
    marginTop: 24,
  },
})

export interface EarningChartPanelProps extends WithStyles<typeof styles> {
  bonusRate?: number
  daysShowing: 1 | 7 | 30
  title: string
  viewLast24Hours: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
}

const _EarningChartPanel = ({
  classes,
  bonusRate,
  daysShowing,
  title,
  viewLast24Hours,
  viewLast7Days,
  viewLast30Days,
}: EarningChartPanelProps) => {
  return (
    <div>
      <div className={classes.titleContainer}>
        <Text variant="baseXXL">{title}</Text>
        {bonusRate && (
          <span className={classes.bonusRateText}>
            <Text>{bonusRate}x Bonus Active</Text>
          </span>
        )}
      </div>
      <div className={classes.buttons}>
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
      </div>
    </div>
  )
}

export const EarningChartPanel = withStyles(styles)(_EarningChartPanel)
