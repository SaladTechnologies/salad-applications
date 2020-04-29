import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { BarChart, Bar, Cell, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { StatElement, SectionHeader } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { EarningWindow } from '../../balance/models'
import classNames from 'classnames'

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
}

const _CustomTooltip = ({ active, payload, classes }: TooltipProps) => {
  if (!active || !payload) {
    return null
  }

  const timestamp = payload[0].payload.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const earnings = payload[0].payload.earnings

  return (
    <div className={classes.tooltipContainer}>
      <div>{timestamp}</div>
      <div>{`$ ${earnings.toFixed(2)}`}</div>
    </div>
  )
}

const CustomTooltip = withStyles(styles)(_CustomTooltip)

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
    const { last24Hr, last7Day, last30Day, earningHistory, classes } = this.props
    const { hoverIndex } = this.state
    return (
      <div className={classes.container}>
        <div className={classes.row}>
          <SectionHeader>Earning History</SectionHeader>
        </div>
        <div className={classNames(classes.row, classes.statsContainer)}>
          <StatElement
            title={'Last 24Hr'}
            values={[`$${last24Hr ? last24Hr.toFixed(2) : 0}`]}
            infoText={'Total amount earned in the past 24 hours'}
          />
          <StatElement
            title={'Last 7 Days'}
            values={[`$${last7Day ? last7Day.toFixed(2) : 0}`]}
            infoText={'Total amount earned in the past 7 days'}
          />
          <StatElement
            title={'Last 30 Days'}
            values={[`$${last30Day ? last30Day.toFixed(2) : 0}`]}
            infoText={'Total amount earned in the past 30 days'}
          />
        </div>
        <div className={classes.row}>
          <div className={classes.chartContainer}>
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
                    content={<CustomTooltip />}
                    isAnimationActive={false}
                    //@ts-ignore
                    position={{ y: 0, x: 'auto' }}
                  />
                  <Bar dataKey="earnings" fill="#B2D530">
                    {earningHistory &&
                      earningHistory.map((window, index) => {
                        if (index === hoverIndex) return <Cell fill={'#DBF1C1'} />
                        else return <Cell key={window.timestamp.toString()} fill={'#B2D530'} />
                      })}
                  </Bar>
                  <XAxis dataKey="timestamp" tickLine={false} stroke="#B2D530" tick={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export const EarningHistory = withStyles(styles)(_EarningHistory)
