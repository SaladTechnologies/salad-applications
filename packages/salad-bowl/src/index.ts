import { JobManager } from './JobManager'
import { createClient } from './HttpClient'
import { ContainerManager } from './ContainerManager'
let client = createClient()

let containerManager = new ContainerManager()
let jobManager = new JobManager(client, containerManager)
jobManager.start()
