//-- Tasklist
//-- Returns an array of Tasklist objects
export class Tasklist {
  name?: string
  pid?: number
  sessionName?: string
  sessionNumber?: number
  memUsage?: number
}

//-- systeminformation
//-- Processes: si.processes().list(... => {...}) - list of all processes including details
export class Processes {
  pid?: number          // process PID
  parentPid?: number    // parent process PID
  name?: string         // process name
  pcpu?: number         // process % CPU usage
  pcpuu?: number        // process % CPU usage (user)
  pcpus?: number        // process % CPU usage (system)
  pmem?: number         // process memory %
  priority?: number     // process priotity
  mem_vsz?: number      // process virtual memory size
  mem_rss?: number      // process mem resident set size
  nice?: number         // process nice value
  started?: string      // process start time
  state?: string        // process state (e.g. sleeping)
  tty?: string          // tty from which process was started
  user?: string         // user who started process
  command?: string      // process starting command
}

//-- Process: si.processLoad(...) - detailed information about given process
export class Process {
  proc?: string         // process name
  pid?: number          // process PID
  pids?: number         // process PID
  cpu?: number          // process % CPU
  mem?: number          // process % MEM
}
