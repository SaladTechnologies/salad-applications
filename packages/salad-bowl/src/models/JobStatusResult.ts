export interface JobStatusResult {
  action: JobAction
}

export enum JobAction {
  Continue = 'continue',
  Abort = 'abort',
}
