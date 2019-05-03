import { JobManager } from './JobManager'
import { createClient } from './HttpClient'

let client = createClient()
let jobManager = new JobManager(client)
jobManager.start()
