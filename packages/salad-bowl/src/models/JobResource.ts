export interface JobResource {
  metadata: {
    id: string
    name: string
    type: string
  }
  container: {
    image: string
    command: string[]
    liveliness: {
      type: string
      frequency: number
    }
    result: string
  }
}
