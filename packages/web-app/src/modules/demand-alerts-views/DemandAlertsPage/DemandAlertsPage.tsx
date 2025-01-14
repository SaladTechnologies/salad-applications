import { Layout, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { useMediaQuery } from 'react-responsive'
import { Head, mobileSize, Scrollbar } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import { DemandAlertsListContainer } from './DemandAlertsList'
import { DemandAlertsSetUpContainer } from './DemandAlertsSetUp'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  page: {
    backgroundImage: 'linear-gradient(to right, #53A626 , #B2D530)',
    color: theme.darkBlue,
    fontFamily: theme.fontMallory,
    height: '100%',
  },
  demandAlertsPageDescription: {
    display: 'block',
    maxWidth: '650px',
  },
  demandContentContainer: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '650px',
  },
})

interface Props extends WithStyles<typeof styles> {}

const _DemandAlertsPage = ({ classes }: Props) => {
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${mobileSize}px)` })

  const getPageContent = () => (
    <Layout background="transparent" title="Demand Alerts">
      <Head title="Demand Alerts" />
      <Text className={classes.demandAlertsPageDescription} variant="baseM">
        You can set up alerts to be notified when the demand level of a GPU reaches your sweet spot, even at a specific
        payout tier. When that scenario arrives we will notify you through email and an in-app message.
      </Text>
      <div className={classes.demandContentContainer}>
        <DemandAlertsSetUpContainer />
        <DemandAlertsListContainer />
      </div>
    </Layout>
  )

  return (
    <div className={classes.page}>
      {isTabletOrMobile ? getPageContent() : <Scrollbar>{getPageContent()}</Scrollbar>}
    </div>
  )
}

export const DemandAlertsPage = withLogin(withStyles(styles)(_DemandAlertsPage))
