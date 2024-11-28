import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  page: {
    backgroundImage: 'linear-gradient(to right, #53A626 , #B2D530)',
    color: theme.darkBlue,
    fontFamily: theme.fontMallory,
    flex: 1,
    height: '100%',
    padding: '25px 36px 25px',
    '@media (min-width:600px)': {
      padding: '50px 62px 14px',
    },
    '@media (min-width:1200px)': {
      padding: '74px 104px 74px',
    },
  },
  demandAlertsPageTitle: {
    color: theme.lightGreen,
    padding: 0,
    marginBottom: '20px',
  },
  demandAlertsPageDescription: {
    display: 'block',
    maxWidth: '650px',
  },
})

interface Props extends WithStyles<typeof styles> {
}

const _DemandAlertsPage = ({ classes }: Props) => {
  return (
    <Scrollbars>
      <div className={classes.page}>
        <Text className={classes.demandAlertsPageTitle} as="h1" variant="headline">
          Demand Alerts
        </Text>
        <Text className={classes.demandAlertsPageDescription} variant="baseM">You can set up alerts to be notified when the demand level of a GPU reaches your sweet spot, even at a specific payout tier. When that scenario arrives we will notify you through email and an in-app message.</Text>
      </div>
    </Scrollbars>
  )
}

export const DemandAlertsPage = withLogin(withStyles(styles)(_DemandAlertsPage))
