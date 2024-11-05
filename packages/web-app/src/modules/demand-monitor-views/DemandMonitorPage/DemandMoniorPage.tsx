import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Scrollbar } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import { DemandMonitorTable } from './DemandMonitorTable'

export const styles = (theme: SaladTheme): Record<string, CSS.Properties> => ({
  pageWrapper: {
    display: 'flex',
    height: '100%',
    width: '100%',
    padding: '64px 32px 0px 32px',
    flexDirection: 'column',
  },
  pageContent: {
    maxWidth: '900px',
  },
  header: {
    margin: 0,
    fontFamily: theme.fontGroteskLight09,
    color: theme.green,
    fontSize: '64px',
    fontWeight: 300,
    textShadow: '0px 0px 24px rgba(178, 213, 48, 0.7)',
  },
  descriptionWrapper: {
    maxWidth: '600px',
  },
  description: {
    fontFamily: 'Mallory',
    color: theme.lightGreen,
    fontSize: '16px',
    lineHeight: '24px',
  },
  demandMonitorTableWrapper: {
    padding: '24px 0px',
  },
})

interface Props extends WithStyles<typeof styles> {}

const _DemandMonitorPage: FunctionComponent<Props> = ({ classes }) => {
  return (
    <Scrollbar>
      <div className={classes.pageWrapper}>
        <div className={classes.pageContent}>
          <Text as="h1" className={classes.header}>
            Salad Network Monitor
          </Text>
          <div className={classes.descriptionWrapper}>
            <Text className={classes.description}>
              Take a birds eye view on how different hardware is performing on the Salad network. This information is
              refreshed hourly.
            </Text>
          </div>
          <div className={classes.demandMonitorTableWrapper}>
            <DemandMonitorTable />
          </div>
        </div>
      </div>
    </Scrollbar>
  )
}

export const DemandMonitorPage = withStyles(styles)(_DemandMonitorPage)
