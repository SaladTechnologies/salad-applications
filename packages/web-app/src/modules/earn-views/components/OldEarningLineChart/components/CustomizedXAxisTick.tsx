import moment from 'moment'
import { MidnightHour, NoonHour } from '../../../pages/constants'

interface CustomizedXAxisTickProps {
  x: number
  y: number
  payload: {
    value: string
  }
  fill: string
  is24HoursChart: boolean
}

export const CustomizedXAxisTick = (props: CustomizedXAxisTickProps) => {
  const { x, y, fill, payload, is24HoursChart } = props
  if (!payload.value || payload.value === '0') {
    return null
  }

  const shouldShowAmPm = payload.value === NoonHour || payload.value === MidnightHour
  const timestamp = is24HoursChart ? moment(payload.value, 'HH').format(shouldShowAmPm ? 'h A' : 'h') : payload.value

  const lines = timestamp.split(' ')

  return (
    <text x={x} y={y} fill={fill}>
      {lines.map((line, index) => (
        <tspan x={x} dy={index === 0 ? 0 : 15} dx={10} key={index}>
          {line}
        </tspan>
      ))}
    </text>
  )
}
