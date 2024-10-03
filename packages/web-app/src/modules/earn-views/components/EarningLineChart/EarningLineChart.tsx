import { LoadingSpinner, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import moment from 'moment'
import { useEffect, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Machine } from '../../../../api/machinesApiClient/generated/models'
import { DefaultTheme, type SaladTheme } from '../../../../SaladTheme'
import { formatBalance } from '../../../../utils'
import type { ChartDaysShowing, EarningPerMachine, EarningWindow } from '../../../balance/models'
import { earningsChartColors } from '../../pages/constants'
import { normalizeEarningsPerMachineData } from '../../utils'
import { CustomizedXAxisTick } from './components'
import type { MachineOptions } from './components/EarningMachineList'
import { EarningMachineList } from './components/EarningMachineList'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  earningLineChartWrapper: {
    height: '400px',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: '24px',
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

const initiallyCheckedMachineOptionsAmount = 5

const getMachineOptions = (earningsPerMachine: EarningPerMachine) => {
  return Object.keys(earningsPerMachine).reduce((machineOptions, machineId, index) => {
    const isCheckedInitially = index < initiallyCheckedMachineOptionsAmount
    return {
      ...machineOptions,
      [machineId]: {
        id: machineId,
        color: earningsChartColors[index] as string,
        isChecked: isCheckedInitially,
      },
    }
  }, {} as MachineOptions)
}

interface Props extends WithStyles<typeof styles> {
  earningsPerMachine: EarningPerMachine
  machines: Machine[] | null
  daysShowing: ChartDaysShowing
  fetchEarningsPerMachine: () => void
}

const _EarningLineChart = ({ classes, machines, earningsPerMachine, daysShowing, fetchEarningsPerMachine }: Props) => {
  const is24HoursChart = daysShowing === 1
  const [machineOptions, setMachineOptions] = useState<MachineOptions>({})

  useEffect(() => {
    setMachineOptions(getMachineOptions(earningsPerMachine))
  }, [earningsPerMachine])

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

  const machineEarningsData = Object.keys(earningsPerMachine).map((machineId) => ({
    id: machineId,
    name: machineId.substring(0, 8),
    data: normalizeEarningsPerMachineData(earningsPerMachine[machineId] as EarningWindow[], daysShowing),
  }))

  useEffect(() => {
    fetchEarningsPerMachine()
  }, [fetchEarningsPerMachine])

  const withMachinesData = machines !== null
  const isLoading = machineEarningsData.length <= 0
  const isNoMachineOptionChecked = !Object.values(machineOptions).some((machineOption) => machineOption.isChecked)

  if (!withMachinesData) {
    return (
      <div className={classes.earningLineChartWrapper}>
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
          <ResponsiveContainer>
            <LineChart
              data={isNoMachineOptionChecked ? machineEarningsData[0]?.data : []}
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
              {machineEarningsData.map(
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
          <EarningMachineList machineOptions={machineOptions} onSelectedMachineChange={handleMachineOptionClick} />
        </>
      )}
    </div>
  )
}

export const EarningLineChart = withStyles(styles)(_EarningLineChart)
