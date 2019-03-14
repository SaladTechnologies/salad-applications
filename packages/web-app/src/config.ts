declare global {
  interface Window {
    config: ProcessEnv
  }
}

export interface ProcessEnv {
  [key: string]: string | undefined
}

const numberOrDefault = (name: string, defaultValue: number): number => {
  let v = Number(process.env[name])

  if (isNaN(v)) return defaultValue

  return v
}

const requiredString = (name: string) => {
  let v = process.env[name]

  if (!v) throw Error(`Unable to find env variable ${name}`)

  return v
}

// const stringOrDefault = (name: string, defaultValue: string): string => {
//   let v = process.env[name]

//   if (!v) return defaultValue

//   return v
// }

export const convertHours = (hours: number): number => hours * 3.6e6
export const convertMinutes = (hours: number): number => hours * 60000

class Config {
  public readonly dataRefreshRate: number = numberOrDefault('APP_REFRESH_RATE', convertMinutes(5))

  public readonly rewardsRefreshRate: number = numberOrDefault('REWARD_REFRESH_RATE', convertMinutes(5))

  public readonly baseAPIUrl: string = requiredString('REACT_APP_API_URL')

  public readonly auth0Domain: string = requiredString('REACT_APP_AUTH0_DOMAIN')
  public readonly auth0ClientId: string = requiredString('REACT_APP_AUTH0_CLIENT_ID')

  /** The current version of the terms of service */
  public readonly termsVersion: string = requiredString('REACT_APP_TERMS_VERSION')
}

const instance = new Config()

export { instance as Config }
