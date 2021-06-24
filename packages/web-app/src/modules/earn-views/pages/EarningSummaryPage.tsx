import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Scrollbar, SectionHeader } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import { EarningWindow } from '../../balance/models'
import { BonusEarningRate } from '../../bonus/models'
import { PantryContainer, SlicedVeggieContainer } from '../../xp-views'
import { EarningHistory, EarningSummary } from '../components'
import { EarningInformationContainer } from '../EarningInformationContainer'

const styles = (theme: SaladTheme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    marginRight: 225,
    paddingTop: '32px',
  },
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexBasis: '50%',
  },
  startContainer: {
    backgroundColor: theme.darkBlue,
    padding: 30,
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {
  currentBalance?: number
  lifetimeBalance?: number
  totalXp?: number
  last24Hr?: number
  last7Day?: number
  last30Day?: number
  earningHistory?: EarningWindow[]
  bonusEarningRate?: BonusEarningRate
}

class _EarningSummaryPage extends Component<Props> {
  render() {
    const { classes, ...rest } = this.props

    return (
      <>
        <SlicedVeggieContainer />
        <Scrollbar>
          <div className={classes.content}>
            <EarningSummary {...rest} />
            <Divider />
            <EarningHistory {...rest} />
            <Divider />
            <SectionHeader>Pantry</SectionHeader>
            <PantryContainer />
          </div>
        </Scrollbar>
      </>
    )
  }
}

export const EarningSummaryPage = withLogin(withStyles(styles)(_EarningSummaryPage), EarningInformationContainer)
