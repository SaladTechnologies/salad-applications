import React, { Component } from 'react'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../../SaladTheme'
//@ts-ignore
import { XYPlot, LineSeries, makeWidthFlexible, XAxis, YAxis, Crosshair } from 'react-vis'
import { Username } from '../../../../components'
import moment from 'moment'
const FlexibleXYPlot = makeWidthFlexible(XYPlot)

interface Pt {
  x: Date
  y: number
}

const generateData = (count: number): Pt[] => {
  let data: Pt[] = []

  for (let i = 0; i < count; i++) {
    data.push({
      x: new Date(i * 100000000),
      y: Math.random() * 0.0005,
    })
  }

  return data
}

const data = generateData(288)

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.green,
    userSelect: 'none',
  },
  mouseOver: {
    backgroundColor: theme.darkBlue,
    padding: '1rem',
  },
  line: {
    color: 'hotpink',
  },
})

interface Props extends WithStyles<typeof styles> {}
interface State {
  nearest?: Pt
}

class _EarningsChart extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      nearest: undefined,
    }
  }

  render() {
    const { classes } = this.props
    const { nearest } = this.state

    return (
      <div className={classes.container}>
        <FlexibleXYPlot xType="time" height={300} onMouseLeave={() => this.setState({ nearest: undefined })}>
          <XAxis
            style={{
              line: { stroke: '#0A2133' },
            }}
          />
          <YAxis
            style={{
              line: { stroke: '#0A2133' },
            }}
          />
          <LineSeries color={'#DBF1C1'} animation data={data} onNearestX={(d: any) => this.setState({ nearest: d })} />
          {nearest && (
            <Crosshair values={[nearest]}>
              <div className={classes.mouseOver}>
                <p>
                  <Username>{moment(nearest.x).format('LT')}</Username>
                </p>
                <Username>${nearest.y.toFixed(5)}</Username>
              </div>
            </Crosshair>
          )}
        </FlexibleXYPlot>
      </div>
    )
  }
}

export const EarningsChart = withStyles(styles)(_EarningsChart)
