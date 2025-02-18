import moment from 'moment'
import type { EarningPerMachine } from '../../../balance/models'

export const mockEarningPerMachine: EarningPerMachine = {
  'id-1': Array.from({ length: 30 }, (_, i) => ({
    timestamp: moment().subtract(i, 'days'),
    earnings: parseFloat((Math.random() * 1).toFixed(2)),
  })).reverse(),
}
