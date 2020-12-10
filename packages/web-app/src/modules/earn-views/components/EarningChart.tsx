import moment from 'moment'
import { uniq } from 'lodash'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { P } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { formatBalance } from '../../../utils'
import { getRangeTooltipTimestamp, getTooltipTimestamp } from '../utils'
import { EarningWindow } from '../../balance/models'
import { Segments } from '../../../components/elements/Segments'

const styles = (theme: SaladTheme) => ({
  buttonContainer: {
    marginLeft: 60,
    marginTop: 10,
  },
  container: {
    display: 'flex',
    paddingTop: 75,
    height: 200,
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
  },
  placeholderText: {
    textAlign: 'center',
    padding: 20,
  },
  earningsRangeContainer: {
    marginLeft: -60,
    marginTop: -25,
    textAlign: 'center',
  },
  tickFont: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.xSmall,
  },
  tooltipContainer: {
    fontFamily: theme.fontGroteskBook25,
    color: theme.lightGreen,
    fontSize: 10,
  },
  rangeSum: {
    fontSize: theme.medium,
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
  daysShowing: 1 | 7 | 30
}

const _CustomTooltip = ({ active, payload, classes, nowWindow, daysShowing }: TooltipProps) => {
  if (!active || !payload) {
    return null
  }

  const window: EarningWindow = payload[0].payload

  const timestamp = getTooltipTimestamp(daysShowing, window.timestamp)
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

interface RangeTooltipProps extends WithStyles<typeof styles> {
  rangeStartTime?: Object
  rangeEndTime?: Object
  rangeSum?: string
  leftToRight?: boolean
  daysShowing: 1 | 30 | 7
}

const _CustomRangeTooltip = ({
  classes,
  leftToRight,
  rangeStartTime,
  rangeEndTime,
  rangeSum,
  daysShowing,
}: RangeTooltipProps) => {
  if (!rangeStartTime || !rangeEndTime || !rangeSum) {
    return null
  }

  const rangeDisplayTimes = getRangeTooltipTimestamp(daysShowing, rangeStartTime, rangeEndTime)

  return (
    <div className={classnames(classes.tooltipContainer, classes.earningsRangeContainer)}>
      <div className={classes.rangeSum}>{rangeSum}</div>
      {leftToRight ? (
        <div>
          {rangeDisplayTimes.startTime} - {rangeDisplayTimes.endTime}
        </div>
      ) : (
        <div>
          {rangeDisplayTimes.endTime} - {rangeDisplayTimes.startTime}
        </div>
      )}
    </div>
  )
}

const CustomRangeTooltip = withStyles(styles)(_CustomRangeTooltip)

interface EarningRange {
  chartX: number
  chartY: number
  index: number
  timestamp: Object
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
    },
  ]
  activeTooltipIndex: number
  chartX: number
  chartY: number
  isTooltipActive: boolean
}

interface CustomTick extends WithStyles<typeof styles> {
  fill: string
  payload: {
    coordinate: number
    isShow: boolean
    offset: number
    tickCoord: number
    value: number
  }
  textAnchor: 'start' | 'middle' | 'end'
  x: string
  y: string
}

const _CustomizedXAxisTick = (props: CustomTick) => {
  const { classes, fill, payload, textAnchor, x, y } = props
  if (!payload) {
    return null
  }

  const timestamp = moment(payload.value).add(15, 'minute').format('hh:mm')
  return (
    <g transform={`translate(${x},${y})`} className={classes.tickFont}>
      <text x={0} y={0} dy={12} fill={fill} textAnchor={textAnchor}>
        {timestamp}
      </text>
    </g>
  )
}

const CustomizedXAxisTick = withStyles(styles)(_CustomizedXAxisTick)

const _CustomizedYAxisTick = (props: CustomTick) => {
  const { classes, fill, payload, textAnchor, x, y } = props
  if (!payload || payload.value === 0) {
    return null
  }

  return (
    <g transform={`translate(${x},${y})`} className={classes.tickFont}>
      <text x={-5} y={0} dy={0} fill={fill} textAnchor={textAnchor}>
        ${payload.value}
      </text>
    </g>
  )
}

const CustomizedYAxisTick = withStyles(styles)(_CustomizedYAxisTick)

interface Props extends WithStyles<typeof styles> {
  earningHistory?: EarningWindow[]
  viewLast24Hours: () => void
  viewLast7Days: () => void
  viewLast30Days: () => void
  daysShowing: 1 | 7 | 30
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
      selectedRangeIndexes: [],
    }
  }

  componentDidMount() {
    this.props.viewLast24Hours()
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.props.earningHistory !== nextProps.earningHistory) {
      return true
    }

    if (this.state.selectingRangeInProgress !== nextState.selectingRangeInProgress) {
      return true
    }

    if (this.state.showEarningsRange !== nextState.showEarningsRange) {
      return true
    }

    if (this.state.selectingRangeInProgress) {
      if (this.state.selectedRangeIndexes !== nextState.selectedRangeIndexes) {
        return true
      }
    }

    if (this.state.showEarningsRange) {
      if (this.state.hoverIndex !== nextState.hoverIndex) {
        return true
      }
    }

    return false
  }

  setEarningsRangeSum = (rangeStartIndex: number | undefined, rangeEndIndex: number | undefined) => {
    const { earningHistory } = this.props

    if (earningHistory && rangeStartIndex && rangeEndIndex && rangeStartIndex !== rangeEndIndex) {
      const selectedLeftToRight = rangeStartIndex < rangeEndIndex
      let start: number = selectedLeftToRight ? rangeStartIndex : rangeEndIndex
      let end: number = selectedLeftToRight ? rangeEndIndex : rangeStartIndex

      const selectedEarnings = earningHistory.slice(start, end + 1)
      let balance: number = 0
      selectedEarnings.map((e) => (balance += e.earnings))
      const earningsRangeSum = formatBalance(balance)

      this.setState({
        earningsRangeSum,
        showEarningsRange: true,
        selectedLeftToRight,
      })
    }
  }

  getEarningsRangeCenterCoordinate = (rangeStart: EarningRange | undefined, rangeEnd: EarningRange | undefined) => {
    if (rangeStart && rangeEnd && rangeStart.chartX !== rangeEnd.chartX) {
      const centerCoordinate: number = Math.round((rangeEnd.chartX + rangeStart?.chartX) / 2)
      this.setState({
        rangeCenterCoordinate: centerCoordinate,
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
      if (this.state.selectedRangeIndexes.length > 0) {
        this.setState({
          selectedRangeIndexes: [],
          earningsRangeStart: undefined,
          earningsRangeEnd: undefined,
          showEarningsRange: false,
        })
      }
      this.setState({
        earningsRangeStart: {
          chartX: a.chartX,
          chartY: a.chartY,
          index: a.activeTooltipIndex,
          timestamp: a.activePayload[0].payload.timestamp,
        },
        selectingRangeInProgress: true,
      })
    }
  }

  handleMouseUp = (a: ChartMouseEvent) => {
    if (a) {
      const earningsRangeEnd = {
        chartX: a.chartX,
        chartY: a.chartY,
        index: a.activeTooltipIndex,
        timestamp: a.activePayload[0].payload.timestamp,
      }
      this.setState({ earningsRangeEnd, selectingRangeInProgress: false })
      this.setEarningsRangeSum(this.state.earningsRangeStart?.index, earningsRangeEnd.index)
      this.getEarningsRangeCenterCoordinate(this.state.earningsRangeStart, earningsRangeEnd)
    }
  }

  getTimeValue = (earningWindow: EarningWindow) => moment(earningWindow.timestamp).valueOf()

  render() {
    const { daysShowing, classes, earningHistory, viewLast24Hours, viewLast7Days, viewLast30Days } = this.props
    const {
      hoverIndex,
      showEarningsRange,
      earningsRangeStart,
      earningsRangeEnd,
      earningsRangeSum,
      rangeCenterCoordinate,
      selectedLeftToRight,
      selectedRangeIndexes,
    } = this.state
    const isZero: boolean =
      !earningHistory || earningHistory.length === 0 || !earningHistory.some((x) => x.earnings > 0)

    const segmentOptions = [
      { name: '24HR', action: viewLast24Hours },
      { name: '7 Days', action: viewLast7Days },
      { name: '30 Days', action: viewLast30Days },
    ]
    return (
      <div className={classes.container}>
        {isZero && (
          <div className={classes.placeholderText}>
            <P>No Earning History. Get Chopping to See Those Earnings!</P>
          </div>
        )}
        {earningHistory && (
          <>
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
                    content={
                      <CustomRangeTooltip
                        rangeStartTime={earningsRangeStart?.timestamp}
                        rangeEndTime={earningsRangeEnd?.timestamp}
                        rangeSum={earningsRangeSum}
                        leftToRight={selectedLeftToRight}
                        daysShowing={daysShowing}
                      />
                    }
                    cursor={false}
                    isAnimationActive={false}
                    position={{ y: 0, x: rangeCenterCoordinate || 0 }}
                  />
                ) : (
                  <Tooltip
                    cursor={<CustomizedCursor />}
                    content={
                      <CustomTooltip nowWindow={earningHistory[earningHistory.length - 1]} daysShowing={daysShowing} />
                    }
                    isAnimationActive={false}
                    //@ts-ignore
                    position={{ y: 0, x: 'auto' }}
                  />
                )}
                <CartesianGrid vertical={false} stroke="#1F4F22" />
                <XAxis
                  dataKey={this.getTimeValue}
                  domain={['auto', 'auto']}
                  interval={3}
                  scale="time"
                  stroke="#B2D530"
                  //@ts-ignore
                  tick={<CustomizedXAxisTick />}
                  type="number"
                />
                <YAxis
                  axisLine={false}
                  minTickGap={2}
                  stroke="#1F4F22"
                  //@ts-ignore
                  tick={<CustomizedYAxisTick />}
                  tickLine={false}
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
              </BarChart>
            </ResponsiveContainer>
            <div className={classes.buttonContainer}>
              <Segments options={segmentOptions} />
            </div>
          </>
        )}
      </div>
    )
  }
}

export const EarningChart = withStyles(styles)(_EarningChart)
