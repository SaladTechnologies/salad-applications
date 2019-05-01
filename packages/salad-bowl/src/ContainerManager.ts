import { JobResource } from './models/JobResource'
import { JobStatus } from './models/JobStatus'
import { exec, spawn } from 'child_process'

export class ContainerManager {
  status: JobStatus

  public runJob = (job: JobResource) => {
    console.log('Container run')
    console.log(job)
    this.status = JobStatus.Started

    // let vmName = 'vm' //TODO: Make this configurable
    //TODO: Create the docker vm via `docker-machine create ${vmName}`

    let imageArgs = job.container.command.map(x => `"${x}"`).join(' ')

    console.log(imageArgs)

    let cmds = [
      // `@FOR /f "tokens=*" %i IN ('docker-machine env ${vmName}') DO @%i`, //Configures the cli to run in the docker vm //TODO: This is causing the job to run multiple times
      `docker run --rm --name ${job.metadata.id}-${job.metadata.name} ${job.container.image} ${imageArgs}`,
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
    })

    ls.on('error', err => {
      console.error('error: ' + err)
      this.status = JobStatus.Failed
    })

    ls.on('exit', msg => {
      console.log('exit: ' + msg)
      this.status = JobStatus.Completed
    })
  }

  public getStatus = (jobId: string): JobStatus => {
    return this.status
  }
}
