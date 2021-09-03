import { Text } from '@saladtechnologies/garden-components'
import classnames from 'classnames'
import { useIntl } from 'react-intl'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import type { EarningWindow } from '../../balance/models'
import { EarningChart } from '../components/EarningChart'
import { EarningChartPanel } from '../components/EarningChartPanel'

const styles = (theme: SaladTheme) => ({
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
  page: {
    flex: 1,
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    display: 'flex',
    height: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  contentContainer: {
    maxWidth: 1280,
    margin: '0 auto',
    marginTop: 96,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  content: {
    color: theme.darkBlue,
    padding: '0 15px',
    width: '100%',
  },
  balance: {
    display: 'flex',
    flexDirection: 'column',
  },
  mb24: {
    marginBottom: 24,
  },
  lightGreenColor: {
    color: theme.lightGreen,
  },
  thousandths: {
    fontSize: 32,
  },
})

export interface EarningsSummaryPageProps extends WithStyles<typeof styles> {
  bonusRate?: number
  currentBalance: number
  daysShowing: 1 | 7 | 30
  earningHistory: EarningWindow[]
  isNative?: boolean
  lifetimeBalance: number
  lifetimeXP: number
  viewLast24HR: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
}

const _EarningsSummaryPage = ({
  classes,
  bonusRate,
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

  // lifetime balance
  const lifetimeBalanceLabel = `${intl.formatNumber(lifetimeBalance, { style: 'decimal', minimumFractionDigits: 4 })}`
  const lifetimeBalanceHundreths = lifetimeBalanceLabel.substring(0, lifetimeBalanceLabel.length - 2)
  const lifetimeBalanceThousandths = lifetimeBalanceLabel.substring(lifetimeBalanceLabel.length - 2)

  return (
    <div className={classes.container}>
      <div className={classes.page}>
        <div className={classes.contentContainer}>
          <Head title="Earnings Summary" />
          <div className={classes.content}>
            <div className={classnames(classes.balance, classes.mb24, classes.lightGreenColor)}>
              <Text variant="base4XL">
                <span aria-hidden="true">
                  <b>{currentBalanceHundreths}</b>
                </span>
                <span className={classes.thousandths} aria-hidden="true">
                  {currentBalanceThousandths}
                </span>
              </Text>
              <Text variant="baseL">Current Balance</Text>
            </div>
            <div className={classnames(classes.balance, classes.mb24)}>
              <Text variant="base4XL">
                <span aria-hidden="true">
                  <b>{lifetimeBalanceHundreths}</b>
                </span>
                <span className={classes.thousandths} aria-hidden="true">
                  {lifetimeBalanceThousandths}
                </span>
              </Text>
              <Text variant="baseL">Lifetime Balance</Text>
            </div>
            <div className={classnames(classes.balance, classes.mb24)}>
              <Text variant="base3XL">{lifetimeXP}</Text>
              <Text variant="baseL">Lifetime XP</Text>
            </div>
            <div className={classes.mb24}>
              <EarningChartPanel
                bonusRate={bonusRate}
                daysShowing={daysShowing}
                title="Earning Summary"
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
          </div>
        </div>
      </div>
    </div>
  )
}

export const EarningsSummaryPage = withStyles(styles)(_EarningsSummaryPage)
