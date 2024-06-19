import { DefaultTheme as GardenTheme, Switch } from '@saladtechnologies/garden-components'
import classnames from 'classnames'
import { uniq } from 'lodash'
import moment from 'moment'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CategoricalChartState } from 'recharts/types/chart/types'
import type { SaladTheme } from '../../../SaladTheme'
import { P } from '../../../components'
import { Segments } from '../../../components/elements/Segments'
import { formatBalance } from '../../../utils'
import type { ChartDaysShowing, EarningWindow } from '../../balance/models'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    height: 250,
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
  },
  removeContainerPadding: {
    paddingTop: 0,
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  segmentsContainer: {
    '&>label:first-child': {
      borderRadius: '2px 0px 0px 2px',
    },
    '&>label:last-child': {
      borderRadius: '0px 2px 2px 0px',
    },
  },
  placeholderText: {
    fontFamily: 'Mallory',
    fontSize: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    textAlign: 'center',
    left: 0,
    right: 0,
    bottom: 0,
    top: 40,
    zIndex: 1,
    color: '#fff',
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
    fontFamily: 'Mallory',
    color: theme.lightGreen,
    fontSize: 12,
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
    fontFamily: 'Mallory',
    color: theme.lightGreen,
    fontSize: 14,
    padding: '2px 9px',
    borderRadius: '24px',
    border: `1px solid ${theme.green}`,
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
  earningPerMachineSwitchWrapper: {
    marginLeft: 32,
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

  return <line strokeWidth={2} x1={xPt} y1={height + 30} x2={xPt} y2={-30} stroke="#B2D530" />
}

interface TooltipProps extends WithStyles<typeof styles> {
  active?: boolean
  payload?: any
  label?: string
  saladBowlEnabled?: boolean
}

const _CustomTooltip = ({ active, payload, classes, saladBowlEnabled }: TooltipProps) => {
  if (!active || !payload) {
    return null
  }

  const window: EarningWindow = payload[0].payload

  const earnings = window.earnings

  return (
    <div
      className={classnames({
        [classes.tooltipContainer]: !saladBowlEnabled,
        [classes.saladBowlToolTipContainer]: saladBowlEnabled,
      })}
    >
      <div>{formatBalance(earnings)}</div>
    </div>
  )
}

const CustomTooltip = withStyles(styles)(_CustomTooltip)

interface RangeTooltipProps extends WithStyles<typeof styles> {
  rangeSum?: string
  saladBowlEnabled?: boolean
}

const _CustomRangeTooltip = ({ classes, rangeSum, saladBowlEnabled }: RangeTooltipProps) => {
  if (!rangeSum) {
    return null
  }

  return (
    <div
      className={classnames(classes.earningsRangeContainer, {
        [classes.saladBowlRangeContainer]: saladBowlEnabled,
        [classes.tooltipContainer]: !saladBowlEnabled,
      })}
    >
      <div className={classes.rangeSum}>{rangeSum}</div>
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
  daysShowing: ChartDaysShowing
  fill: string
  payload: {
    coordinate: number
    isShow: boolean
    offset: number
    tickCoord: number
    value: number
    index: number
  }
  textAnchor: 'start' | 'middle' | 'end'
  x: string
  y: string
  saladBowlEnabled?: boolean
}

const _CustomizedXAxisTick = (props: CustomTick) => {
  const { classes, daysShowing, fill, payload, textAnchor, x, y, saladBowlEnabled } = props
  let timestamp

  if (!payload) {
    return null
  }

  const isMidnight = moment(payload.value).add(15, 'minute').hours() === 0
  const isNoon = moment(payload.value).add(15, 'minute').hours() === 12
  const shouldShowAmPm = daysShowing === 1
  const shouldShowDateMonth = daysShowing === 7

  if (shouldShowAmPm) {
    timestamp = moment(payload.value).add(15, 'minute').format('h')
  } else if (shouldShowDateMonth) {
    timestamp = moment(payload.value).add(15, 'minute').format('D/M')
  } else {
    timestamp = moment(payload.value).add(15, 'minute').format('D')
  }

  return (
    <>
      <g
        transform={`translate(${x},${y})`}
        className={classnames(classes.tickFont, classes.tickMobile, {
          [classes.saladBowlTickFont]: saladBowlEnabled,
        })}
      >
        <text x={0} y={0} dx={10} dy={2} fill={fill} textAnchor="start">
          {timestamp}
        </text>
        {shouldShowAmPm && (
          <text x={0} y={0} dx={30} dy={15} fill={fill} textAnchor="end">
            {isMidnight ? 'AM' : isNoon ? 'PM' : ''}
          </text>
        )}
      </g>
      <g
        transform={`translate(${x},${y})`}
        className={classnames(classes.tickFont, classes.tickDesktop, {
          [classes.saladBowlTickFont]: saladBowlEnabled,
        })}
      >
        <text x={15} y={0} fill={fill} textAnchor={textAnchor}>
          {timestamp}
        </text>
        {shouldShowAmPm && (
          <text x={20} y={0} dy={15} fill={fill} textAnchor={textAnchor}>
            {isMidnight ? 'AM' : isNoon ? 'PM' : ''}
          </text>
        )}
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
      <text x={10} y={0} dy={0} fill={fill} textAnchor={textAnchor}>
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
  daysShowing: ChartDaysShowing
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
  isEarningsPerMachineEnabled: boolean
}

class _EarningChart extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedRangeIndexes: [],
      isEarningsPerMachineEnabled: false,
    }
  }

  public override componentDidMount() {
    this.props.viewLast24Hours()
  }

  public override shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
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

    if (this.state.isEarningsPerMachineEnabled !== nextState.isEarningsPerMachineEnabled) {
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
          if (uniqueIndexes[i]! - uniqueIndexes[i - 1]! !== 1) {
            let missingSequenceNum: number = uniqueIndexes[i - 1]! + 1
            while (missingSequenceNum < uniqueIndexes[i]!) {
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

  handleEarningsPerMachineClick = () => {
    this.setState((prevState) => ({
      isEarningsPerMachineEnabled: !prevState.isEarningsPerMachineEnabled,
    }))
  }

  public override render(): ReactNode {
    const { daysShowing, classes, earningHistory, viewLast24Hours, viewLast7Days, viewLast30Days } = this.props
    const { hoverIndex, showEarningsRange, earningsRangeSum, rangeCenterCoordinate, selectedRangeIndexes } = this.state
    const isZero: boolean =
      !earningHistory || earningHistory.length === 0 || !earningHistory.some((x) => x.earnings > 0)

    const segmentOptions = [
      { name: '24 Hours', action: viewLast24Hours },
      { name: '7 Days', action: viewLast7Days },
      { name: '30 Days', action: viewLast30Days },
    ]

    return (
      <div className={classnames(classes.container)}>
        <div
          className={classnames(classes.placeholderText, {
            [classes.placeholderTextHidden]: !isZero,
          })}
        >
          <P>No data to display</P>
        </div>
        <div className={classes.chartHeader}>
          <div className={classes.segmentsContainer}>
            <Segments options={segmentOptions} />
          </div>
          <div className={classes.earningPerMachineSwitchWrapper}>
            <Switch
              label="Earnings Per Machine"
              checked={this.state.isEarningsPerMachineEnabled}
              onChange={this.handleEarningsPerMachineClick}
              variant="light"
            />
          </div>
        </div>
        {earningHistory && (
          <>
            <ResponsiveContainer>
              <BarChart
                data={earningHistory}
                margin={{ top: 30, left: 10, right: 0, bottom: 10 }}
                barCategoryGap={daysShowing === 7 ? '40%' : '15%'}
                onMouseMove={this.handleMouseEvent}
                onMouseLeave={this.handleMouseEvent}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                barGap={10}
              >
                <CartesianGrid vertical={false} stroke="#3B4D5C" />
                {showEarningsRange && !isZero ? (
                  <Tooltip
                    content={<CustomRangeTooltip rangeSum={earningsRangeSum} saladBowlEnabled={false} />}
                    cursor={false}
                    isAnimationActive={false}
                    position={{ y: 0, x: rangeCenterCoordinate || 0 }}
                  />
                ) : (
                  <Tooltip
                    wrapperStyle={{ border: 'none' }}
                    cursor={<CustomizedCursor />}
                    content={<CustomTooltip saladBowlEnabled={false} />}
                    isAnimationActive={false}
                    //@ts-ignore
                    position={{ y: 0, x: 'auto' }}
                    offset={5}
                  />
                )}
                <XAxis
                  dataKey={this.getTimeValue}
                  domain={['auto', 'auto']}
                  interval={daysShowing === 1 ? 3 : 0}
                  padding={{ left: 5, right: daysShowing === 1 ? 5 : 30 }}
                  scale="time"
                  stroke="#DBF1C1"
                  tickSize={15}
                  tickMargin={0}
                  tick={
                    //@ts-ignore
                    <CustomizedXAxisTick daysShowing={daysShowing} saladBowlEnabled={false} />
                  }
                  type="number"
                />
                <YAxis
                  axisLine={false}
                  minTickGap={2}
                  stroke="#DBF1C1"
                  tickMargin={10}
                  //@ts-ignore
                  tick={<CustomizedYAxisTick saladBowlEnabled={false} />}
                  tickLine={false}
                />
                <Bar dataKey="earnings" fill="#B2D530">
                  {earningHistory &&
                    earningHistory.map((window, index) => {
                      let color = '#DBF1C1'
                      let border = ''
                      let dash = ''

                      if (hoverIndex) {
                        color = 'rgb(219, 241, 193, 0.5)'
                      }

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
          </>
        )}
      </div>
    )
  }
}

export const EarningChart = withStyles(styles)(_EarningChart)
