import { JobResource } from './models/JobResource'
import { JobStatus } from './models/JobStatus'
import { exec, spawn } from 'child_process'

export class ContainerManager {
  public status: JobStatus
  public readonly startTime: Date
  public stopTime: Date

  constructor(public readonly job: JobResource) {
    this.status = JobStatus.Started
    this.startTime = new Date()

    // let vmName = 'vm' //TODO: Make this configurable
    //TODO: Create the docker vm via `docker-machine create ${vmName}`

    let imageArgs = job.container.command.map(x => `"${x}"`).join(' ')
    let jobName = `${job.metadata.id}-${job.metadata.name}`

    console.log(`Starting job:${jobName}, Image:${job.container.image}, args:${imageArgs}`)

    let cmds = [
      // `@FOR /f "tokens=*" %i IN ('docker-machine env ${vmName}') DO @%i`, //Configures the cli to run in the docker vm //TODO: This is causing the job to run multiple times
      `docker run --rm --name ${jobName} ${job.container.image} ${imageArgs}`,
    ]

    let ls = spawn(cmds.join('&'), {
      shell: true,
      windowsHide: false,
    })

    if (ls.stdout) {
      ls.stdout.on('data', data => {
        console.log('stdout: ' + data)
      })
    }

    if (ls.stderr) {
      ls.stderr.on('data', data => {
        console.error('stderr: ' + data)
      })
    }

    ls.on('close', code => {
      console.log('closed with exit code: ' + code)
      this.status = JobStatus.Completed
      this.stopTime = new Date()
    })

    ls.on('error', err => {
      console.error('error: ' + err)
      this.status = JobStatus.Failed
      this.stopTime = new Date()
    })

    ls.on('exit', msg => {
      console.log('exit: ' + msg)
    })
  }

  public getMetrics = (): {} => {
    return {
      duration: this.stopTime.valueOf() - this.startTime.valueOf(),
    }
  }
}
