import type CSS from 'csstype'
import moment from 'moment'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DefaultTheme, type SaladTheme } from '../../../../SaladTheme'
import { formatBalance } from '../../../../utils'
import type { ChartDaysShowing, EarningPerMachine, EarningWindow } from '../../../balance/models'
import { earningsChartColors } from '../../pages/constants'
import { normalizeEarningsPerMachineData } from '../../utils'
import { CustomizedXAxisTick } from './components'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  tickFont: {
    fontFamily: 'Mallory',
    color: theme.lightGreen,
    fontSize: '12px',
  },
  tooltipWrapper: {
    color: theme.lightGreen,
    fontSize: '14px',
    padding: '2px 9px',
    borderRadius: '24px',
    border: `1px solid ${theme.green}`,
  },
})

interface Props extends WithStyles<typeof styles> {
  earningsPerMachine: EarningPerMachine
  daysShowing: ChartDaysShowing
}

const _EarningLineChart = ({ classes, earningsPerMachine, daysShowing }: Props) => {
  const is24HoursChart = daysShowing === 1

  const machineEarningsData = Object.keys(earningsPerMachine).map((key) => ({
    name: key.substring(0, 8),
    data: normalizeEarningsPerMachineData(earningsPerMachine[key] as EarningWindow[], daysShowing),
  }))

  return (
    <ResponsiveContainer width="100%" height={210}>
      <LineChart>
        <CartesianGrid vertical={false} stroke="#3B4D5C" />
        <XAxis
          allowDuplicatedCategory={false}
          className={classes.tickFont}
          dataKey="timestamp"
          padding={{ left: 5, right: is24HoursChart ? 5 : 30 }}
          stroke={DefaultTheme.lightGreen}
          tickMargin={0}
          tickSize={15}
          // @ts-ignore
          tick={<CustomizedXAxisTick is24HoursChart={is24HoursChart} />}
        />
        <YAxis
          axisLine={false}
          className={classes.tickFont}
          dataKey="earnings"
          minTickGap={2}
          stroke={DefaultTheme.lightGreen}
          tickFormatter={(earnings) => (earnings === 0 ? '' : `$${earnings}`)}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ backgroundColor: DefaultTheme.darkBlue }}
          formatter={(value) => formatBalance(Number(value))}
          labelFormatter={(value) => (is24HoursChart ? moment(value, 'HH').format('h A') : value)}
          wrapperClassName={classes.tooltipWrapper}
        />
        {machineEarningsData.map((machineEarning, index) => (
          <Line
            data={machineEarning.data}
            dataKey="earnings"
            fill={earningsChartColors[index]}
            key={machineEarning.name}
            name={machineEarning.name}
            stroke={earningsChartColors[index]}
            type="monotone"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export const EarningLineChart = withStyles(styles)(_EarningLineChart)
