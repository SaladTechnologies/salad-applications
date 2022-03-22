import { DefaultTheme as GardenTheme } from '@saladtechnologies/garden-components'
import classnames from 'classnames'
import { uniq } from 'lodash'
import moment from 'moment'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart'
import { P } from '../../../components'
import { Segments } from '../../../components/elements/Segments'
import { FeatureManagerConsumer } from '../../../FeatureManager'
import { SaladTheme } from '../../../SaladTheme'
import { formatBalance } from '../../../utils'
import { EarningWindow } from '../../balance/models'
import { getRangeTooltipTimestamp, getTooltipTimestamp } from '../utils'

const styles = (theme: SaladTheme) => ({
  buttonContainer: {
    marginLeft: 60,
    marginTop: 10,
  },
  container: {
    display: 'flex',
    paddingTop: 75,
    height: 250,
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
  },
  removeContainerPadding: {
    paddingTop: 0,
  },
  placeholderText: {
    textAlign: 'center',
  },
  placeholderTextHidden: {
    visibility: 'hidden',
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
  saladBowlTickFont: {
    // @ts-ignore The garden theme is not typed correctly, will need update in garden
    ...GardenTheme.typography.variants.baseXS,
  },
  saladBowlToolTipContainer: {
    // @ts-ignore The garden theme is not typed correctly, will need update in garden
    ...GardenTheme.typography.variants.baseXS,
    marginTop: -5,
  },
  saladBowlRangeContainer: {
    // @ts-ignore The garden theme is not typed correctly, will need update in garden
    ...GardenTheme.typography.variants.baseS,
    marginTop: -20,
  },
  tooltipContainer: {
    fontFamily: theme.fontGroteskBook25,
    color: theme.lightGreen,
    fontSize: 10,
  },
  rangeSum: {
    fontSize: theme.medium,
  },
  tickDesktop: {
    display: 'none',
  },
  tickMobile: {
    display: 'block',
  },
  '@media screen and (min-width: 1025px)': {
    tickDesktop: {
      display: 'block',
    },
    tickMobile: {
      display: 'none',
    },
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
  saladBowlEnabled?: boolean
}

const _CustomTooltip = ({ active, payload, classes, nowWindow, daysShowing, saladBowlEnabled }: TooltipProps) => {
  if (!active || !payload) {
    return null
  }

  const window: EarningWindow = payload[0].payload

  const timestamp = getTooltipTimestamp(daysShowing, window.timestamp)
  const earnings = window.earnings
  const isNow = window === nowWindow

  return (
    <div
      className={classnames({
        [classes.tooltipContainer]: !saladBowlEnabled,
        [classes.saladBowlToolTipContainer]: saladBowlEnabled,
      })}
    >
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
  saladBowlEnabled?: boolean
}

const _CustomRangeTooltip = ({
  classes,
  leftToRight,
  rangeStartTime,
  rangeEndTime,
  rangeSum,
  daysShowing,
  saladBowlEnabled,
}: RangeTooltipProps) => {
  if (!rangeStartTime || !rangeEndTime || !rangeSum) {
    return null
  }

  const rangeDisplayTimes = getRangeTooltipTimestamp(daysShowing, rangeStartTime, rangeEndTime)

  return (
    <div
      className={classnames(classes.earningsRangeContainer, {
        [classes.saladBowlRangeContainer]: saladBowlEnabled,
        [classes.tooltipContainer]: !saladBowlEnabled,
      })}
    >
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

interface CustomTick extends WithStyles<typeof styles> {
  daysShowing: 1 | 7 | 30
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
  saladBowlEnabled?: boolean
}

const _CustomizedXAxisTick = (props: CustomTick) => {
  const { classes, daysShowing, fill, payload, textAnchor, x, y, saladBowlEnabled } = props
  if (!payload) {
    return null
  }

  const timestamp =
    daysShowing === 30
      ? moment(payload.value).add(15, 'minute').format('M/D') +
        ' ' +
        moment(payload.value).add(15, 'minute').format('A')
      : moment(payload.value).add(15, 'minute').format('hh:mm')
  return (
    <>
      <g
        transform={`translate(${x},${y})`}
        className={classnames(classes.tickFont, classes.tickMobile, {
          [classes.saladBowlTickFont]: saladBowlEnabled,
        })}
      >
        <text x={0} y={0} dy={4} fill={fill} textAnchor="end" transform="rotate(-25)">
          {timestamp}
        </text>
      </g>
      <g
        transform={`translate(${x},${y})`}
        className={classnames(classes.tickFont, classes.tickDesktop, {
          [classes.saladBowlTickFont]: saladBowlEnabled,
        })}
      >
        <text x={0} y={0} dy={12} fill={fill} textAnchor={textAnchor}>
          {timestamp}
        </text>
      </g>
    </>
  )
}

const CustomizedXAxisTick = withStyles(styles)(_CustomizedXAxisTick)

const _CustomizedYAxisTick = (props: CustomTick) => {
  const { classes, fill, payload, textAnchor, x, y, saladBowlEnabled } = props
  if (!payload || payload.value === 0) {
    return null
  }

  return (
    <g
      transform={`translate(${x},${y})`}
      className={classnames(classes.tickFont, {
        [classes.saladBowlTickFont]: saladBowlEnabled,
      })}
    >
      <text x={-5} y={0} dy={0} fill={fill} textAnchor={textAnchor}>
        ${payload.value}
      </text>
    </g>
  )
}

const CustomizedYAxisTick = withStyles(styles)(_CustomizedYAxisTick)

interface Props extends WithStyles<typeof styles> {
  earningHistory: EarningWindow[]
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

    if (this.state.hoverIndex !== nextState.hoverIndex) {
      return true
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

  handleMouseEvent = (nextState: CategoricalChartState) => {
    if (nextState) {
      const { selectingRangeInProgress, selectedRangeIndexes } = this.state

      if (selectingRangeInProgress) {
        const uniqueIndexes = uniq(selectedRangeIndexes.concat(nextState.activeTooltipIndex ?? 0))
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

      if (!nextState.isTooltipActive) {
        this.setState({ hoverIndex: undefined, selectedRangeIndexes: [], showEarningsRange: false })
      } else {
        this.setState({ hoverIndex: nextState.activeTooltipIndex })
      }
    }
  }

  handleMouseDown = (nextState: CategoricalChartState) => {
    if (nextState) {
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
          chartX: nextState.chartX ?? 0,
          chartY: nextState.chartY ?? 0,
          index: nextState.activeTooltipIndex ?? 0,
          timestamp:
            nextState.activePayload !== undefined && nextState.activePayload[0] !== undefined
              ? nextState.activePayload[0].payload.timestamp
              : undefined,
        },
        selectingRangeInProgress: true,
      })
    }
  }

  handleMouseUp = (nextState: CategoricalChartState) => {
    if (nextState) {
      const earningsRangeEnd = {
        chartX: nextState.chartX ?? 0,
        chartY: nextState.chartY ?? 0,
        index: nextState.activeTooltipIndex ?? 0,
        timestamp:
          nextState.activePayload !== undefined && nextState.activePayload[0] !== undefined
            ? nextState.activePayload[0].payload.timestamp
            : undefined,
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

    let timePeriod: string
    switch (daysShowing) {
      case 1:
        timePeriod = '24 Hours'
        break
      case 7:
        timePeriod = '7 Days'
        break
      case 30:
        timePeriod = '30 Days'
        break
    }

    const saladBowlFeature = 'app_salad_bowl'
    return (
      <FeatureManagerConsumer>
        {(value) => (
          <div
            className={classnames(classes.container, {
              [classes.removeContainerPadding]: value.isEnabledCached(saladBowlFeature),
            })}
          >
            <div
              className={classnames(classes.placeholderText, {
                [classes.placeholderTextHidden]: !isZero,
              })}
            >
              <P>No Earning History During the Last {timePeriod}. Get Chopping to See Those Earnings!</P>
            </div>
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
                    <CartesianGrid
                      vertical={false}
                      stroke={value.isEnabled(saladBowlFeature) ? '#DBF1C1' : '#1F4F22'}
                    />
                    {showEarningsRange && !isZero ? (
                      <Tooltip
                        content={
                          <CustomRangeTooltip
                            rangeStartTime={earningsRangeStart?.timestamp}
                            rangeEndTime={earningsRangeEnd?.timestamp}
                            rangeSum={earningsRangeSum}
                            leftToRight={selectedLeftToRight}
                            daysShowing={daysShowing}
                            saladBowlEnabled={value.isEnabled(saladBowlFeature)}
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
                          <CustomTooltip
                            nowWindow={earningHistory[earningHistory.length - 1]}
                            daysShowing={daysShowing}
                            saladBowlEnabled={value.isEnabled(saladBowlFeature)}
                          />
                        }
                        isAnimationActive={false}
                        //@ts-ignore
                        position={{ y: 0, x: 'auto' }}
                      />
                    )}
                    <XAxis
                      dataKey={this.getTimeValue}
                      domain={['auto', 'auto']}
                      interval={7}
                      scale="time"
                      stroke={value.isEnabled(saladBowlFeature) ? '#0A2133' : '#B2D530'}
                      tick={
                        //@ts-ignore
                        <CustomizedXAxisTick
                          daysShowing={daysShowing}
                          saladBowlEnabled={value.isEnabled(saladBowlFeature)}
                        />
                      }
                      type="number"
                    />
                    <YAxis
                      axisLine={false}
                      minTickGap={2}
                      stroke={value.isEnabled(saladBowlFeature) ? '#0A2133' : '#B2D530'}
                      //@ts-ignore
                      tick={<CustomizedYAxisTick saladBowlEnabled={value.isEnabled(saladBowlFeature)} />}
                      tickLine={false}
                    />
                    <Bar dataKey="earnings" fill="#B2D530">
                      {earningHistory &&
                        earningHistory.map((window, index) => {
                          let color = value.isEnabled(saladBowlFeature) ? '#0A2133' : '#B2D530'
                          let border = ''
                          let dash = ''

                          if (index === hoverIndex) {
                            color = '#DBF1C1'
                          }

                          if (value.isEnabled(saladBowlFeature) && selectedRangeIndexes.length > 0) {
                            color = '#DBF1C1'
                          }

                          if (selectedRangeIndexes.length > 0 && !selectedRangeIndexes.includes(index)) {
                            color = '#0A2133'
                            border = value.isEnabled(saladBowlFeature) ? '#0A2133' : '#B2D530'
                          }

                          if (index === earningHistory.length - 1) {
                            border = color
                            color = '#0A2133'
                            dash = '3 3'
                          }

                          return (
                            <Cell
                              key={window.timestamp.toString()}
                              fill={color}
                              stroke={border}
                              strokeDasharray={dash}
                            />
                          )
                        })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {!value.isEnabled(saladBowlFeature) && (
                  <div className={classes.buttonContainer}>
                    <Segments options={segmentOptions} />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </FeatureManagerConsumer>
    )
  }
}

export const EarningChart = withStyles(styles)(_EarningChart)
