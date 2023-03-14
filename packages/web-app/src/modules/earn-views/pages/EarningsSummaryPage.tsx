import { Layout, Text } from '@saladtechnologies/garden-components'
import classnames from 'classnames'
import Scrollbars from 'react-custom-scrollbars'
import { useIntl } from 'react-intl'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Head } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import type { EarningWindow } from '../../balance/models'
import { EarningChart } from '../components/EarningChart'
import { EarningChartPanel } from '../components/EarningChartPanel'
import { getIntervalEarnings } from '../utils'

const styles = (theme: SaladTheme) => ({
  balance: {
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectedHardware: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 64,
  },
  sectionTitle: {
    marginBottom: 11,
  },
  hardwareCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gridGap: 24,
    marginTop: 24,
    '@media (min-width: 600px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (min-width: 900px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
  lightGreenColor: {
    color: theme.lightGreen,
  },
  mb24: {
    marginBottom: 24,
  },
  page: {
    flex: 1,
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    display: 'flex',
    height: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  panelContainer: {
    marginTop: 40,
  },
  summaryContainer: {
    color: theme.darkBlue,
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gridGap: 24,
    '@media (min-width: 600px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (min-width: 900px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
  summaryItem: {
    marginBottom: 0,
    '@media (min-width: 900px)': {
      marginBottom: 24,
    },
  },
  thousandths: {
    fontSize: 32,
  },
  activeWorkloadsContainer: {
    overflow: 'hidden',
    paddingBottom: 100,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  firstColumn: {
    flex: '2 1',
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flex: '1 1',
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  titleRow: {
    color: theme.darkBlue,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  contentRow: {
    color: theme.darkBlue,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
})

export interface EarningsSummaryPageProps extends WithStyles<typeof styles> {
  currentBalance: number
  daysShowing: 1 | 7 | 30
  earningHistory: EarningWindow[]
  lifetimeBalance: number
  lifetimeXP: number
  viewLast24HR: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
}

const _EarningsSummaryPage = ({
  classes,
  currentBalance,
  daysShowing,
  lifetimeBalance,
  lifetimeXP,
  earningHistory,
  viewLast24HR,
  viewLast7Days,
  viewLast30Days,
}: EarningsSummaryPageProps) => {
  const intl = useIntl()

  // current balance
  const currentBalanceLabel = `${intl.formatNumber(currentBalance, { style: 'decimal', minimumFractionDigits: 4 })}`
  const currentBalanceHundreths = currentBalanceLabel.substring(0, currentBalanceLabel.length - 2)
  const currentBalanceThousandths = currentBalanceLabel.substring(currentBalanceLabel.length - 2)
  const currentLifeTimeXPFormatted = intl.formatNumber(lifetimeXP)

  // lifetime balance
  const lifetimeBalanceLabel = `${intl.formatNumber(lifetimeBalance, { style: 'decimal', minimumFractionDigits: 4 })}`
  const lifetimeBalanceHundreths = lifetimeBalanceLabel.substring(0, lifetimeBalanceLabel.length - 2)
  const lifetimeBalanceThousandths = lifetimeBalanceLabel.substring(lifetimeBalanceLabel.length - 2)

  const intervalEarnings = getIntervalEarnings(earningHistory)

  return (
    <div className={classes.container}>
      <div className={classes.page}>
        <Scrollbars>
          <Layout title="Earnings Summary">
            <Head title="Earnings Summary" />
            <div className={classes.summaryContainer}>
              <div className={classnames(classes.balance, classes.summaryItem)}>
                <Text variant="baseL">Current Balance</Text>
                <Text variant="base4XL">
                  <span aria-hidden="true" className={classes.lightGreenColor}>
                    ${currentBalanceHundreths}
                  </span>
                  <span className={classnames(classes.thousandths, classes.lightGreenColor)} aria-hidden="true">
                    {currentBalanceThousandths}
                  </span>
                </Text>
              </div>
              <div className={classnames(classes.balance, classes.summaryItem)}>
                <Text variant="baseL">Lifetime Balance</Text>
                <Text variant="base4XL">
                  <span aria-hidden="true">${lifetimeBalanceHundreths}</span>
                  <span className={classes.thousandths} aria-hidden="true">
                    {lifetimeBalanceThousandths}
                  </span>
                </Text>
              </div>
              <div className={classnames(classes.balance, classes.summaryItem)}>
                <Text variant="baseL">Lifetime XP</Text>
                <Text variant="base4XL">{currentLifeTimeXPFormatted}</Text>
              </div>
            </div>
            <div className={classes.panelContainer}>
              <EarningChartPanel
                intervalEarnings={intervalEarnings}
                daysShowing={daysShowing}
                title="Earnings History"
                viewLast24Hours={viewLast24HR}
                viewLast7Days={viewLast7Days}
                viewLast30Days={viewLast30Days}
              />
            </div>
            <EarningChart
              daysShowing={daysShowing}
              earningHistory={earningHistory}
              viewLast24Hours={viewLast24HR}
              viewLast7Days={viewLast7Days}
              viewLast30Days={viewLast30Days}
            />
          </Layout>
        </Scrollbars>
      </div>
    </div>
  )
}

export const EarningsSummaryPage = withStyles(styles)(_EarningsSummaryPage)
