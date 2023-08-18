import type { FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { SectionHeader } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import { EarningChartContainer } from '../EarningChartContainer'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 860,
    position: 'relative',
  },
  subtitle: {
    fontFamily: 'Mallory',
    fontSize: 16,
    color: theme.lightGreen,
    margin: '8px 0px 0px',
    lineHeight: 1.5,
    marginTop: 32,
    marginBottom: 10,
  },
})

interface Props extends WithStyles<typeof styles> {}

const EarningHistoryRaw: FC<Props> = ({ classes }) => (
  <div className={classes.container}>
    <SectionHeader>Earning History</SectionHeader>
    <p className={classes.subtitle}>See earnings from the last...</p>
    <EarningChartContainer />
  </div>
)

export const EarningHistory = withStyles(styles)(EarningHistoryRaw)
