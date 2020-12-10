import classNames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SectionHeader, StatElement } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { formatBalance } from '../../../utils'
import { EarningWindow } from '../../balance/models'
import { EarningChartContainer } from '../EarningChartContainer'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
  },
  statsContainer: {
    justifyContent: 'space-around',
    flex: 1,
    paddingTop: 20,
  },
  chartContainer: {
    paddingTop: 75,
    height: 200,
    width: '100%',
    position: 'relative',
  },
  tooltipContainer: {
    fontFamily: theme.fontGroteskBook25,
    color: theme.lightGreen,
    fontSize: 10,
  },
  placeholderText: {
    textAlign: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {
  last24Hr?: number
  last7Day?: number
  last30Day?: number
  earningHistory?: EarningWindow[]
}

interface State {
  hoverIndex?: number
}

class _EarningHistory extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  handleMouseEvent = (a: { isTooltipActive: boolean; activeTooltipIndex: number }) => {
    if (!a.isTooltipActive) {
      this.setState({ hoverIndex: undefined })
    } else {
      this.setState({ hoverIndex: a.activeTooltipIndex })
    }
  }

  render() {
    const { last24Hr, last7Day, last30Day, classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.row}>
          <SectionHeader>Earning History</SectionHeader>
        </div>
        <div className={classNames(classes.row, classes.statsContainer)}>
          <StatElement
            title={'Last 24Hr'}
            values={[formatBalance(last24Hr)]}
            infoText={'Total amount earned in the past 24 hours'}
          />
          <StatElement
            title={'Last 7 Days'}
            values={[formatBalance(last7Day)]}
            infoText={'Total amount earned in the past 7 days'}
          />
          <StatElement
            title={'Last 30 Days'}
            values={[formatBalance(last30Day)]}
            infoText={'Total amount earned in the past 30 days'}
          />
        </div>
        <div className={classes.row}>
          <EarningChartContainer />
        </div>
      </div>
    )
  }
}

export const EarningHistory = withStyles(styles)(_EarningHistory)
