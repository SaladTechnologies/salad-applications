declare global {
  interface Window {
    config: ProcessEnv
  }
}

export interface ProcessEnv {
  [key: string]: string | undefined
}

// const numberOrDefault = (name: string, defaultValue: number): number => {
//   let v = Number(process.env[name])

//   if (isNaN(v)) return defaultValue

//   return v
// }

// const optionalBool = (name: string): boolean => {
//   let v = process.env[name]

//   switch (v) {
//     case 'true':
//     case '1':
//     case 'yes':
//       return true
//     default:
//       return false
//   }
// }

// const requiredString = (name: string) => {
//   let v = process.env[name]

//   console.log(process.env)

//   if (!v) throw Error(`Unable to find env variable ${name}`)

//   return v
// }

// const optionalString = (name: string): string | undefined => {
//   return process.env[name]
// }

export const convertHours = (hours: number): number => hours * 3.6e6
export const convertMinutes = (hours: number): number => hours * 60000

class Config {
  // public readonly appUrl: string = 'http://localhost:3000/'
  public readonly appUrl: string = 'https://0-2-1--salad-web-app.netlify.com/'
  // public readonly appUrl: string = 'https://app.salad.io'
}

const instance = new Config()

export { instance as Config }
