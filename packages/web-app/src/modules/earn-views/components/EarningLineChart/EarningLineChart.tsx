import { LoadingSpinner, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import moment from 'moment'
import { useEffect, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DefaultTheme, type SaladTheme } from '../../../../SaladTheme'
import { formatBalance } from '../../../../utils'
import type { ChartDaysShowing, EarningPerMachine, EarningWindow } from '../../../balance/models'
import { normalizeEarningsPerMachineData } from '../../utils'
import { ViewData } from '../EarningHistory/constants'
import { CustomizedXAxisTick } from './components'
import type { MachineOptions } from './components/EarningMachineList'
import { EarningMachineList } from './components/EarningMachineList'
import { aggregateMachineOption } from './constants'
import { getAggregatedMachineEarningsValue, getMachineOptions } from './utils'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  earningLineChartWrapper: {
    height: '400px',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    '@media (max-width: 812px)': {
      overflowX: 'scroll',
      overflowY: 'hidden',
    },
    gap: '24px',
  },
  noDataWrapper: {
    height: '400px',
  },
  loaderWrapper: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.lightGreen,
  },
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
  viewData: ViewData
}

const _EarningLineChart = ({ classes, earningsPerMachine, daysShowing, viewData }: Props) => {
  const is24HoursChart = daysShowing === 1
  const isAggregateView = viewData === ViewData.Aggregate
  const [machineOptions, setMachineOptions] = useState<MachineOptions>({})

  useEffect(() => {
    setMachineOptions(isAggregateView ? aggregateMachineOption : getMachineOptions(earningsPerMachine))
  }, [earningsPerMachine, isAggregateView])

  const handleMachineOptionClick = (machineId: string) => {
    setMachineOptions(
      (prevMachineOptions) =>
        ({
          ...prevMachineOptions,
          [machineId]: {
            ...prevMachineOptions[machineId],
            isChecked: !prevMachineOptions[machineId]?.isChecked,
          },
        } as MachineOptions),
    )
  }

  const individualMachineEarnings = Object.keys(earningsPerMachine).map((machineId) => ({
    id: machineId,
    name: machineId.substring(0, 8),
    data: normalizeEarningsPerMachineData(earningsPerMachine[machineId] as EarningWindow[], daysShowing),
  }))

  const aggregatedMachineEarningsValue = getAggregatedMachineEarningsValue(earningsPerMachine)

  const aggregateMachineEarnings = [
    {
      id: 'Aggregate',
      name: 'Aggregate',
      data: normalizeEarningsPerMachineData(aggregatedMachineEarningsValue as EarningWindow[], daysShowing),
    },
  ]

  const machineEarnings = isAggregateView ? aggregateMachineEarnings : individualMachineEarnings

  const withMachines = Object.keys(earningsPerMachine).length !== 0
  const isLoading = machineEarnings.length <= 0
  const isNoMachineOptionChecked = !Object.values(machineOptions).some((machineOption) => machineOption.isChecked)

  if (!withMachines) {
    return (
      <div className={classes.noDataWrapper}>
        <div className={classes.loaderWrapper}>
          <Text variant="baseM">No data to display</Text>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.earningLineChartWrapper}>
      {isLoading ? (
        <div className={classes.loaderWrapper}>
          <LoadingSpinner variant="light" size={100} />
        </div>
      ) : (
        <>
          <ResponsiveContainer minWidth={650} minHeight={290}>
            <LineChart
              data={isNoMachineOptionChecked ? machineEarnings[0]?.data : []}
              margin={{ top: 30, left: 10, right: 0, bottom: 10 }}
            >
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
              {machineEarnings.map(
                (machineEarning) =>
                  machineOptions[machineEarning.id]?.isChecked && (
                    <Line
                      data={machineEarning.data}
                      dataKey="earnings"
                      fill={machineOptions[machineEarning.id]?.color}
                      key={machineEarning.name}
                      name={machineEarning.name}
                      stroke={machineOptions[machineEarning.id]?.color}
                      type="monotone"
                    />
                  ),
              )}
            </LineChart>
          </ResponsiveContainer>
          <EarningMachineList
            isAggregateView={isAggregateView}
            machineOptions={machineOptions}
            onSelectedMachineChange={handleMachineOptionClick}
          />
        </>
      )}
    </div>
  )
}

export const EarningLineChart = withStyles(styles)(_EarningLineChart)
