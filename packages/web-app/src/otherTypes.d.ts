declare module 'is-retry-allowed' {
  declare function isRetryAllowed(error: any): boolean

  export = isRetryAllowed
}
