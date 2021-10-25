import { computed } from 'mobx'
import { RootStore } from '../../Store'
import { ActiveWorkloadProps, ActiveWorkloads } from './models'

export class ActiveWorkloadsUIStore {
  constructor(private readonly store: RootStore) {}

  @computed
  get activeWorkloads(): ActiveWorkloads | [] {
    const workloads = this.store.saladBowl.workloadState

    const filteredWorkloads = workloads?.filter((workload) => {
      if (workload.id === 'gpuz' || workload.id === 'systeminformation') {
        return false
      } else if (workload.choptime === undefined) {
        return false
      } else {
        return true
      }
    })

    const activeWorkloads: ActiveWorkloads = []

    filteredWorkloads?.slice().forEach((workload) => {
      const workloadMetaData: ActiveWorkloadProps = {}
      workload.metadataMap.forEach((metadata) => {
        if (metadata[0] === 'algorithm') {
          workloadMetaData.algorithm = metadata[1]
        }

        if (metadata[0] === 'name') {
          workloadMetaData.name = metadata[1]
        }

        if (metadata[0] === 'version') {
          workloadMetaData.version = metadata[1]
        }
      })
      activeWorkloads.push(workloadMetaData)
    })

    return activeWorkloads
  }
}
