import moment from 'moment'
import { uniq } from 'lodash'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
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
  earningsRangeContainer: {
    marginLeft: -60,
    marginTop: -25,
    textAlign: 'center'
  },
  rangeSum: {
    fontSize: theme.medium,
  }
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

interface RangeTooltipProps extends WithStyles<typeof styles> {
  rangeStartTime?: string
  rangeEndTime?: string
  rangeSum?: string
  leftToRight?: boolean
}


const _CustomRangeTooltip = ({ classes, leftToRight, rangeStartTime, rangeEndTime, rangeSum }: RangeTooltipProps) => {
  if (!rangeStartTime || !rangeEndTime || !rangeSum) {
    return null
  }

  return (
    <div className={classnames(classes.tooltipContainer, classes.earningsRangeContainer)}>
      <div className={classes.rangeSum}>{rangeSum}</div>
      {leftToRight ? (
        <div>{rangeStartTime} - {rangeEndTime}</div>
      ) : (
          <div>{rangeEndTime} - {rangeStartTime}</div>
        )}

    </div>
  )
}

const CustomRangeTooltip = withStyles(styles)(_CustomRangeTooltip)

interface EarningRange {
  chartX: number
  chartY: number
  index: number
  timestamp: string
}

interface ChartMouseEvent {
  activeLabel: string
  activeCoordinate: {
    x: number
    y: number
  }
  activePayload: [
    {
      color: string
      datakey: string
      fill: string
      formatter: string
      name: string
      payload: {
        earnings: number
        unit: number
        timestamp: Object
      }
      type?: string
      value: number
    }
  ]
  activeTooltipIndex: number
  chartX: number
  chartY: number
  isTooltipActive: boolean
}

interface State {
  earningsRangeEnd?: EarningRange
  earningsRangeStart?: EarningRange
  earningsRangeSum?: string
  hoverIndex?: number
  selectingRangeInProgress?: boolean
  rangeCenterCoordinate?: number
  selectedLeftToRight?: boolean
  selectedRangeIndexes: number[]
  showEarningsRange?: boolean
}

class _EarningChart extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedRangeIndexes: []
    }
  }


  setEarningsRangeSum = (rangeStartIndex: number | undefined, rangeEndIndex: number | undefined) => {
    const { earningHistory } = this.props

    if (earningHistory && rangeStartIndex && rangeEndIndex && rangeStartIndex !== rangeEndIndex) {
      const selectedLeftToRight = rangeStartIndex < rangeEndIndex
      let start: number = selectedLeftToRight ? rangeStartIndex : rangeEndIndex
      let end: number = selectedLeftToRight ? rangeEndIndex : rangeStartIndex

      const selectedEarnings = earningHistory.slice(start, end + 1);
      let balance: number = 0
      selectedEarnings.map((e) => (balance += e.earnings))
      const earningsRangeSum = formatBalance(balance)

      this.setState({
        earningsRangeSum,
        showEarningsRange: true,
        selectedLeftToRight
      })
    }
  }

  getEarningsRangeCenterCoordinate = (rangeStart: EarningRange | undefined, rangeEnd: EarningRange | undefined) => {
    if (rangeStart && rangeEnd && (rangeStart.chartX !== rangeEnd.chartX)) {
      const centerCoordinate: number = Math.round((rangeEnd.chartX + rangeStart?.chartX) / 2)
      this.setState({
        rangeCenterCoordinate: centerCoordinate
      })
    }
  }

  handleMouseEvent = (a: ChartMouseEvent) => {
    if (a) {
      const { selectingRangeInProgress, selectedRangeIndexes } = this.state

      if (selectingRangeInProgress) {
        const uniqueIndexes = uniq(selectedRangeIndexes.concat(a.activeTooltipIndex))
        for (var i = 1; i < uniqueIndexes.length; i++) {
          if (uniqueIndexes[i] - uniqueIndexes[i - 1] !== 1) {
            let missingSequenceNum: number = uniqueIndexes[i - 1] + 1
            while (missingSequenceNum < uniqueIndexes[i]) {
              uniqueIndexes.push(missingSequenceNum)
              missingSequenceNum++
            }
          }
        }
        this.setState({ selectedRangeIndexes: uniqueIndexes.sort() })
      }

      if (!a.isTooltipActive) {
        this.setState({ hoverIndex: undefined, selectedRangeIndexes: [], showEarningsRange: false })
      } else {
        this.setState({ hoverIndex: a.activeTooltipIndex })
      }
    }
  }

  handleMouseDown = (a: ChartMouseEvent) => {
    if (a) {
      const timestamp = moment(a.activePayload[0].payload.timestamp).add(15, 'minute').format('LT')
      if (this.state.selectedRangeIndexes.length > 0) {
        this.setState({ selectedRangeIndexes: [], earningsRangeStart: undefined, earningsRangeEnd: undefined, showEarningsRange: false })
      }
      this.setState({
        earningsRangeStart: {
          chartX: a.chartX,
          chartY: a.chartY,
          index: a.activeTooltipIndex,
          timestamp
        },
        selectingRangeInProgress: true
      })
    }
  }

  handleMouseUp = (a: ChartMouseEvent) => {
    if (a) {
      const timestamp = moment(a.activePayload[0].payload.timestamp).add(15, 'minute').format('LT')
      const earningsRangeEnd = {
        chartX: a.chartX,
        chartY: a.chartY,
        index: a.activeTooltipIndex,
        timestamp
      }
      this.setState({ earningsRangeEnd, selectingRangeInProgress: false })
      this.setEarningsRangeSum(this.state.earningsRangeStart?.index, earningsRangeEnd.index)
      this.getEarningsRangeCenterCoordinate(this.state.earningsRangeStart, earningsRangeEnd)
    }
  }

  render() {
    const { earningHistory, classes } = this.props
    const {
      hoverIndex,
      showEarningsRange,
      earningsRangeStart,
      earningsRangeEnd,
      earningsRangeSum,
      rangeCenterCoordinate,
      selectedLeftToRight,
      selectedRangeIndexes
    } = this.state
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
              onMouseDown={this.handleMouseDown}
              onMouseUp={this.handleMouseUp}
              barGap={10}
            >
              {showEarningsRange ? (
                <Tooltip
                  content={<CustomRangeTooltip rangeStartTime={earningsRangeStart?.timestamp} rangeEndTime={earningsRangeEnd?.timestamp} rangeSum={earningsRangeSum} leftToRight={selectedLeftToRight} />}
                  cursor={false}
                  isAnimationActive={false}
                  position={{ y: 0, x: rangeCenterCoordinate || 0 }}
                />
              ) : (
                  <Tooltip
                    cursor={<CustomizedCursor />}
                    content={<CustomTooltip nowWindow={earningHistory[earningHistory.length - 1]} />}
                    isAnimationActive={false}
                    //@ts-ignore
                    position={{ y: 0, x: 'auto' }}
                  />
                )}
              <Bar dataKey="earnings" fill="#B2D530">
                {earningHistory &&
                  earningHistory.map((window, index) => {
                    let color = '#B2D530'
                    let border = ''
                    let dash = ''

                    if (index === hoverIndex) {
                      color = '#DBF1C1'
                    }

                    if (selectedRangeIndexes.length > 0 && !selectedRangeIndexes.includes(index)) {
                      color = '#0A2133'
                      border = '#B2D530'
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
