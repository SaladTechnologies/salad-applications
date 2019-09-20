import featureFlags from './featureFlags.json'

export const featureFlag = (flag: string): boolean => {
  //@ts-ignore
  if (featureFlags.hasOwnProperty(flag)) {
    //@ts-ignore
    return featureFlags[flag] === true
  }
  return false
}
