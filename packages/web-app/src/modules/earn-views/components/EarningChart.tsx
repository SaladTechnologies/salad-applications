import moment from 'moment'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { P } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { formatBalance } from '../../../utils'
import { EarningWindow } from '../../balance/models'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    paddingTop: 75,
    height: 200,
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
  },
  tooltipContainer: {
    fontFamily: theme.fontGroteskBook25,
    color: theme.lightGreen,
    fontSize: 10,
  },
  placeholderText: {
    textAlign: 'center',
    padding: 20,
  },
})

const CustomizedCursor = (props: any) => {
  const { height, width, x } = props
  const xPt = x + width / 2.0
  return <line x1={xPt} y1={height + 30} x2={xPt} y2={-30} stroke="#DBF1C1" />
}

interface TooltipProps extends WithStyles<typeof styles> {
  active?: boolean
  payload?: any
  label?: string
  nowWindow?: EarningWindow
}

const _CustomTooltip = ({ active, payload, classes, nowWindow }: TooltipProps) => {
  if (!active || !payload) {
    return null
  }

  const window: EarningWindow = payload[0].payload

  const timestamp = moment(window.timestamp).add(15, 'minute').format('LT')
  const earnings = window.earnings
  const isNow = window === nowWindow

  return (
    <div className={classes.tooltipContainer}>
      <div>{isNow ? 'Current' : timestamp}</div>
      <div>{formatBalance(earnings)}</div>
    </div>
  )
}

const CustomTooltip = withStyles(styles)(_CustomTooltip)

interface Props extends WithStyles<typeof styles> {
  earningHistory?: EarningWindow[]
}

interface State {
  hoverIndex?: number
}

class _EarningChart extends Component<Props, State> {
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
    const { earningHistory, classes } = this.props
    const { hoverIndex } = this.state
    const isZero: boolean =
      !earningHistory || earningHistory.length === 0 || !earningHistory.some((x) => x.earnings > 0)
    return (
      <div className={classes.container}>
        {isZero && (
          <div className={classes.placeholderText}>
            <P>No Earning History. Get Chopping to See Those Earnings!</P>
          </div>
        )}
        {earningHistory && (
          <ResponsiveContainer>
            <BarChart
              data={earningHistory}
              margin={{ top: 30, left: 10, right: 10, bottom: 0 }}
              onMouseMove={this.handleMouseEvent}
              onMouseLeave={this.handleMouseEvent}
              barGap={10}
            >
              <Tooltip
                cursor={<CustomizedCursor />}
                content={<CustomTooltip nowWindow={earningHistory[earningHistory.length - 1]} />}
                isAnimationActive={false}
                //@ts-ignore
                position={{ y: 0, x: 'auto' }}
              />
              <Bar dataKey="earnings" fill="#B2D530">
                {earningHistory &&
                  earningHistory.map((window, index) => {
                    let color = '#B2D530'
                    let border = ''
                    let dash = ''

                    if (index === hoverIndex) {
                      color = '#DBF1C1'
                    }

                    if (index === earningHistory.length - 1) {
                      border = color
                      color = '#0A2133'
                      dash = '3 3'
                    }
                    return (
                      <Cell key={window.timestamp.toString()} fill={color} stroke={border} strokeDasharray={dash} />
                    )
                  })}
              </Bar>
              <XAxis dataKey="timestamp" tickLine={false} stroke="#B2D530" tick={false} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    )
  }
}

export const EarningChart = withStyles(styles)(_EarningChart)
