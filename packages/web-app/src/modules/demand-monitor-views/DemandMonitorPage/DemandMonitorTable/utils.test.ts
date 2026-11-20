import { describe, expect, it } from 'vitest'
import type { DemandedHardwarePerformance } from '../../../../earnings/demand-monitor.ts'
import { sortByDemand, sortHardwareDemandPerformance } from './utils'

describe('sortHardwareDemandPerformance', () => {
  it('sorts a copy and leaves the list it is given as it was', () => {
    const list = [{ utilizationPct: 10 }, { utilizationPct: 90 }] as unknown as DemandedHardwarePerformance[]
    const before = [...list]

    sortHardwareDemandPerformance({
      demandedHardwarePerformanceList: list,
      sortRule: sortByDemand,
      sortOrder: 'descending',
    })

    expect(list).toStrictEqual(before)
  })
})
