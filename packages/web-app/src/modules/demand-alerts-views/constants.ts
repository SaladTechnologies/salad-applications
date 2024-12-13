import type { DropdownOption } from "../../components/Dropdown"

export const demandSubscriptionsPath = '/api/v2/demand-monitor/subscriptions'

export const mockedGpuNames = [
  { label: 'NVIDIA RTX 4090', value: 'NVIDIA RTX 4090' },
  { label: 'NVIDIA RTX 4080', value: 'NVIDIA RTX 4080' },
  { label: 'NVIDIA RTX 4070 Ti Super', value: 'NVIDIA RTX 4070 Ti Super' },
]

export const demandScenario: Record<number, DropdownOption> = {
  80: { label: 'High Demand', value: '80' },
  50: { label: 'Moderate Demand', value: '50' },
  0: { label: 'Low Demand', value: '0' },
}
