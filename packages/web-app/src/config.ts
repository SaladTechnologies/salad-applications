declare global {
  interface Window {
    config: ProcessEnv
  }
}

export interface ProcessEnv {
  [key: string]: string | undefined
}

const numberOrDefault = (name: string, defaultValue: number): number => {
  if (window.config === undefined) return defaultValue

  let v = Number(window.config[name])

  if (isNaN(v)) return defaultValue

  return v
}

const stringOrDefault = (name: string, defaultValue: string): string => {
  if (window.config === undefined) return defaultValue

  let v = window.config[name]

  if (!v) return defaultValue

  return v
}

export const convertHours = (hours: number): number => hours * 3.6e6
export const convertMinutes = (hours: number): number => hours * 60000

class Config {
  public readonly dataRefreshRate: number = numberOrDefault('APP_REFRESH_RATE', convertMinutes(5))

  public readonly rewardsRefreshRate: number = numberOrDefault('REWARD_REFRESH_RATE', convertMinutes(5))

  public readonly baseAPIUrl: string = stringOrDefault('BASE_API_URL', '')
}

const instance = new Config()

export { instance as Config }
