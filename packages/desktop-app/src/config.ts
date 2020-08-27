class Config {
  // public readonly appUrl: string = 'https://app.salad.io'
  public readonly appUrl: string = 'https://canary-app.salad.io/'
  // public readonly appUrl: string = 'http://localhost:3000/'
}

const instance = new Config()

export { instance as Config }
