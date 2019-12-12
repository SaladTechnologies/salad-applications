import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { BalanceEvent } from '../../balance/models'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import moment from 'moment'

const itemHeight = 16

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: theme.small,
    textAlign: 'right',
    letterSpacing: '1.5px',
    fontVariantNumeric: 'tabular-nums',
    userSelect: 'none',
  },
  title: {
    color: theme.mediumGreen,
    textTransform: 'uppercase',
  },
  eventContainer: {
    padding: '1px 0',
    color: theme.lightGreen,
    height: itemHeight,
  },
  moveEnter: {
    opacity: 0.01,
    height: 0,
    transform: 'translate(-40px, 0)',
  },
  moveEnterActive: {
    opacity: 1,
    height: itemHeight,
    transform: 'translate(0, 0)',
    transition: 'all 500ms ease-out',
  },
  moveExit: {
    opacity: 1,
    height: itemHeight,
    transform: 'translate(0, 0)',
  },
  moveExitActive: {
    opacity: 0.01,
    height: 0,
    transform: 'translate(40px, 0)',
    transition: 'all 500ms ease-in',
  },
})

interface Props extends WithStyles<typeof styles> {
  balanceEvents?: BalanceEvent[]
}

interface State {
  currentTime: moment.Moment
}

class _EarningEventsList extends Component<Props, State> {
  private refreshTimer?: number

  constructor(props: Props) {
    super(props)
    this.state = {
      currentTime: moment.utc(),
    }
  }

  componentDidMount() {
    this.refreshTimer = setInterval(() => {
      this.setState({
        currentTime: moment.utc(),
      })
    }, 60 * 1000)
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer)
  }

  render() {
    const { balanceEvents, classes } = this.props
    const { currentTime } = this.state

    moment.locale('en', {
      relativeTime: {
        future: '',
        past: '',
        s: 'now',
        ss: 'now',
        m: '1m ago',
        mm: '%dm ago',
        h: '1h ago',
        hh: '%dh ago',
        d: '1d ago',
        dd: '%dd ago',
        M: '1M ago',
        MM: '%dM ago',
        y: '1Y ago',
        yy: '%dY ago',
      },
    })

    const itemList =
      balanceEvents &&
      balanceEvents.map(x => (
        <CSSTransition
          key={x.id}
          timeout={500}
          classNames={{
            enter: classes.moveEnter,
            enterActive: classes.moveEnterActive,
            exit: classes.moveExit,
            exitActive: classes.moveExitActive,
          }}
        >
          <div className={classnames(classes.eventContainer)}>
            ${x.deltaBalance.toFixed(5)} ({x.timestamp.from(currentTime, true)})
          </div>
        </CSSTransition>
      ))

    return (
      <div className={classnames(classes.container)}>
        <div className={classes.title}>Payouts</div>
        <TransitionGroup>{itemList}</TransitionGroup>
      </div>
    )
  }
}

export const EarningEventsList = withStyles(styles)(_EarningEventsList)
