import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, SectionHeader, StatElement } from '../../../components'
import { formatBalance } from '../../../utils'
import { EarningChartContainer } from '../../earn-views'

const styles = () => ({
  container: {},
  item: {
    paddingTop: 10,
  },
})

interface Props extends WithStyles<typeof styles> {
  currentBalance?: number
  lifetimeBalance?: number
  totalXp?: number
}

class _MobileEarningSummary extends Component<Props> {
  render() {
    const { currentBalance, lifetimeBalance, totalXp, classes } = this.props

    return (
      <div className={classes.container}>
        <SectionHeader>Summary</SectionHeader>
        <div className={classes.item}>
          <StatElement
            title={'Current Balance'}
            values={[formatBalance(currentBalance)]}
            infoText={'Current balance available to spend'}
          />
        </div>
        <div className={classes.item}>
          <StatElement
            title={'Lifetime Balance'}
            values={[formatBalance(lifetimeBalance)]}
            infoText={'Total balance earned'}
          />
        </div>
        <div className={classes.item}>
          <StatElement
            title={'Total XP'}
            values={[Math.round(totalXp || 0).toLocaleString() || '0']}
            infoText={`XP stands for "Experience Points". You are awarded 1 XP per minute of confirmed mining time. The more XP you have, the more veggies you will unlock in the Pantry.`}
          />
        </div>
        <Divider />
        <SectionHeader>Earning History</SectionHeader>
        <EarningChartContainer />
        <Divider />
      </div>
    )
  }
}

export const MobileEarningSummary = withStyles(styles)(_MobileEarningSummary)
