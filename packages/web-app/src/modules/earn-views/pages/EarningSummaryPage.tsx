import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Scrollbar } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { EarningSummary, EarningHistory } from '../components'
import { EarningWindow } from '../../balance/models'

const styles = (theme: SaladTheme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
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
  last24Hr?: number
  last7Day?: number
  last30Day?: number
  earningHistory?: EarningWindow[]
}

class _EarningSummaryPage extends Component<Props> {
  render() {
    const { classes, ...rest } = this.props

    return (
      <Scrollbar>
        <div className={classes.content}>
          <EarningSummary {...rest} />
          <Divider />
          <EarningHistory {...rest} />
        </div>
      </Scrollbar>
    )
  }
}

export const EarningSummaryPage = withStyles(styles)(_EarningSummaryPage)
