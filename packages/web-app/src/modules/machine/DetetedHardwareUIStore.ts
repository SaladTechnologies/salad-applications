import { HardwareCardProps } from '@saladtechnologies/garden-components'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { computed } from 'mobx'
import { RootStore } from '../../Store'

export class DetectedHardwareUIStore {
  constructor(private readonly store: RootStore) {}

  @computed
  get hardwareCards(): HardwareCardProps[] | [] {
    const cpuName = this.store.native.machineInfo?.cpu?.brand

    let cards = []
    if (cpuName !== undefined) {
      const cpuCard: HardwareCardProps = {
        configured: this.store.saladBowl.cpuMiningEnabled,
        configureWorkloadLabel: 'Enable CPU Workloads',
        configureWorkloadClick: () => this.store.saladBowl.setCpu(true),
        configureWorkloadPending: this.store.saladBowl.cpuMiningUpdatePending,
        configureWorkloadDisabled: !this.store.saladBowl.saladBowlConnected,
        name: cpuName,
        stats: [
          { label: 'Temperature', stat: undefined },
          { label: 'Utilization', stat: undefined },
        ],
        type: 'cpu',
        workloads: [],
      }

      cards.push(cpuCard)
    }

    return cards
  }
}
