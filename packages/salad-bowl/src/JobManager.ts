import { AxiosInstance } from 'axios'
import * as Config from './config'
import { JobResource } from './models/JobResource'
import { ContainerManager } from './ContainerManager'
import { JobStatusResult, JobAction } from './models/JobStatusResult'
import { JobStatus } from './models/JobStatus'

export class JobManager {
  private retryTimer: NodeJS.Timeout | undefined
  private statusTimer: NodeJS.Timeout
  private started = false
  private currentJob: JobResource | undefined

  constructor(private readonly axios: AxiosInstance, private readonly containerManager: ContainerManager) {}

  public start = () => {
    if (this.started) {
      console.warn('Job Manager already started.')
      return
    }
    this.started = true
    console.log('Starting job server')

    //Start the status service that will check the current status from the container manager

    this.statusTimer = setInterval(this.reportStatus, Config.statusReportRate)

    //Start polling the api to see if we need a job
    this.getNewJob()
  }

  private reportStatus = async () => {
    if (!this.currentJob) {
      console.log('No current job. Nothing to report status on')
      return
    }

    let jobId = this.currentJob.metadata.id

    let status = this.containerManager.getStatus(jobId)

    if (status === JobStatus.Completed) {
      // let result = await this.axios.post(jo)
      this.currentJob = undefined
      this.getNewJob()
    } else {
      try {
        let result = await this.axios.post<JobStatusResult>('job-status', {
          jobs: [{ id: jobId, status: status }],
        })

        switch (result.data.action) {
          case JobAction.Continue:
            console.log('Continue running job')
            break
          case JobAction.Abort:
            this.abortJob(jobId)
            break
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  private getNewJob = async () => {
    try {
      let res = await this.axios.get<JobResource>('get-job')

      //Run a valid job, otherwise try again in X sec
      if (res.status === 200) {
        this.runJob(res.data)
      } else {
        this.retryTimer = setTimeout(this.getNewJob, Config.jobPollingRate)
      }
    } catch (err) {
      console.error('Error')
    }
  }

  public runJob = (job: JobResource): void => {
    console.log('Running job ' + job.metadata.id)

    this.currentJob = job

    this.containerManager.runJob(job)
  }

  public abortJob = (id: string): void => {
    console.log('Aborting job ' + id)
  }
}
