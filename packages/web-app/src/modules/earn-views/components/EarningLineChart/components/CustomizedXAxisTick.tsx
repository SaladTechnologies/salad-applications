import moment from 'moment'
import { MidnightHour, NoonHour } from '../../../pages/constants'

interface CustomizedXAxisTickProps {
  x: number
  y: number
  payload: {
    value: string
  }
  fill: string
  daysShowing: number
}

export const CustomizedXAxisTick = (props: CustomizedXAxisTickProps) => {
  const { x, y, fill, payload, daysShowing } = props
  const is24HoursChart = daysShowing === 1
  const is30DaysChart = daysShowing === 30

  if (!payload.value || payload.value === '0') {
    return null
  }


  let timestamp = payload.value
  if (is24HoursChart) {
    const shouldShowAmPm = payload.value === NoonHour || payload.value === MidnightHour
    timestamp = moment(payload.value, 'HH').format(shouldShowAmPm ? 'h A' : 'h')
  } else if (is30DaysChart) {
    timestamp = payload.value.split('/')[0] as string
  }

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
