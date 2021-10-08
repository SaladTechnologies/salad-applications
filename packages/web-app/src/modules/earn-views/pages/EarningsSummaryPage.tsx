import { ButtonLink, HardwareCard, HardwareCardProps, Layout, Text } from '@saladtechnologies/garden-components'
import classnames from 'classnames'
import Scrollbars from 'react-custom-scrollbars'
import { useIntl } from 'react-intl'
import withStyles, { WithStyles } from 'react-jss'
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
    top: (props: EarningsSummaryPageProps) => (props.isNative ? '4.1rem' : 0),
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
  detectedHardwareTitle: {
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
})

export interface EarningsSummaryPageProps extends WithStyles<typeof styles> {
  currentBalance: number
  daysShowing: 1 | 7 | 30
  earningHistory: EarningWindow[]
  isNative?: boolean
  lifetimeBalance: number
  lifetimeXP: number
  viewLast24HR: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
  hardwareDetected: HardwareCardProps[] | []
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
  hardwareDetected,
  isNative,
}: EarningsSummaryPageProps) => {
  const intl = useIntl()

  // current balance
  const currentBalanceLabel = `${intl.formatNumber(currentBalance, { style: 'decimal', minimumFractionDigits: 4 })}`
  const currentBalanceHundreths = currentBalanceLabel.substring(0, currentBalanceLabel.length - 2)
  const currentBalanceThousandths = currentBalanceLabel.substring(currentBalanceLabel.length - 2)

  // lifetime balance
  const lifetimeBalanceLabel = `${intl.formatNumber(lifetimeBalance, { style: 'decimal', minimumFractionDigits: 4 })}`
  const lifetimeBalanceHundreths = lifetimeBalanceLabel.substring(0, lifetimeBalanceLabel.length - 2)
  const lifetimeBalanceThousandths = lifetimeBalanceLabel.substring(lifetimeBalanceLabel.length - 2)

  const intervalEarnings = getIntervalEarnings(earningHistory)

  const hasHardware = hardwareDetected.length > 0

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
                    <b>{currentBalanceHundreths}</b>
                  </span>
                  <span className={classnames(classes.thousandths, classes.lightGreenColor)} aria-hidden="true">
                    {currentBalanceThousandths}
                  </span>
                </Text>
              </div>
              <div className={classnames(classes.balance, classes.summaryItem)}>
                <Text variant="baseL">Lifetime Balance</Text>
                <Text variant="base4XL">
                  <span aria-hidden="true">
                    <b>{lifetimeBalanceHundreths}</b>
                  </span>
                  <span className={classes.thousandths} aria-hidden="true">
                    {lifetimeBalanceThousandths}
                  </span>
                </Text>
              </div>
              <div className={classnames(classes.balance, classes.summaryItem)}>
                <Text variant="baseL">Lifetime XP</Text>
                <Text variant="base4XL">{lifetimeXP}</Text>
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
            {isNative && hasHardware && (
              <div className={classes.detectedHardware}>
                <div className={classnames(classes.detectedHardwareTitle, classes.lightGreenColor)}>
                  <Text variant="base3XL">Detected Hardware</Text>
                </div>
                <ButtonLink variant="outlined" label="Machine Settings" to="/earn/machine-settings" />
                <div className={classes.hardwareCards}>
                  {hardwareDetected.map((hardware, index) => (
                    <HardwareCard
                      key={index}
                      name={hardware.name}
                      setupHardwareButtonLabel={hardware.setupHardwareButtonLabel}
                      setupHardwareButtonClick={hardware.setupHardwareButtonClick}
                      stats={hardware.stats}
                      type={hardware.type}
                      workloads={hardware.workloads}
                    />
                  ))}
                </div>
              </div>
            )}
          </Layout>
        </Scrollbars>
      </div>
    </div>
  )
}

export const EarningsSummaryPage = withStyles(styles)(_EarningsSummaryPage)
