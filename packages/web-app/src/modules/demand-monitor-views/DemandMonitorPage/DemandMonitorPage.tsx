import { Button, Text } from '@saladtechnologies/garden-components'
import { Bell } from '@saladtechnologies/garden-icons'
import type CSS from 'csstype'
import { type FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { useMediaQuery } from 'react-responsive'
import { mobileSize, Scrollbar } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import { DemandMonitorFAQ } from './DemandMonitorFAQ'
import { DemandMonitorTableContainer } from './DemandMonitorTable/DemandMonitorTableContainer'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  pageWrapper: {
    display: 'flex',
    height: '100%',
    width: '100%',
    padding: '64px 32px 0px 32px',
    flexDirection: 'column',
    boxSizing: 'border-box',
    '@media (max-width: 812px)': {
      padding: '16px 4px 4px 4px',
      marginTop: '0px',
      marginLeft: '0px',
      width: '100%',
    },
  },
  pageContent: {
    maxWidth: '820px',
  },
  header: {
    margin: 0,
    fontFamily: theme.fontMallory,
    color: theme.green,
    fontSize: '32px',
    fontWeight: 500,
    textShadow: '0px 0px 24px rgba(178, 213, 48, 0.7)',
    paddingBottom: '16px',
  },
  descriptionWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  description: {
    fontFamily: 'Mallory',
    color: theme.lightGreen,
    fontSize: '16px',
    lineHeight: '24px',
  },
  sectionWrapper: {
    padding: '24px 0px',
    width: '100%',
  },
})
interface Props extends WithStyles<typeof styles> {}

const _DemandMonitorPage: FunctionComponent<Props> = ({ classes }) => {
  const getPageContent = () => {
    return (
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
            <Button width={148} leadingIcon={<Bell />} label='Get Notified' variant='secondary' />
          </div>
          <div className={classes.sectionWrapper}>
            <DemandMonitorTableContainer />
          </div>
          <div className={classes.sectionWrapper}>
            <DemandMonitorFAQ />
          </div>
        </div>
      </div>
    )
  }

  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${mobileSize}px)` })

  return isTabletOrMobile ? getPageContent() : <Scrollbar>{getPageContent()}</Scrollbar>
}

export const DemandMonitorPage = withStyles(styles)(_DemandMonitorPage)
