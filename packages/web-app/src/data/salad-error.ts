import type { AxiosResponse } from 'axios'

/** The message to show for each App API problem type (the server's `ErrorTypes.cs`). */
const messages: ReadonlyMap<string, string> = new Map([
  ['general:unknown', 'Unknown Error'],
  [
    'redemptions:insufficientBalance',
    `Must construct additional pylons ...just kidding! You balance isn't enough to redeem this reward, try again after you’ve earned some more`,
  ],
  ['redemptions:disabled', 'Redemptions are currently disabled, please try again later.'],
  ['rewards:notFound', 'Reward not found'],
  ['rewards:outOfStock', 'This reward has run out. Check back later!'],
  ['users:notFound', 'User not found'],
])

/** Returns the message to show for an App API problem type. */
const messageOf = (type: string): string => (type === '' ? 'Unknown Error' : (messages.get(type) ?? 'Unknown error'))

/** The problem a {@link SaladError} reports. */
export interface Problem {
  /** The HTTP status code. */
  status: number
  /** The problem type, such as `rewards:outOfStock`. */
  type: string
  /** The problem's title. */
  title?: string | undefined
  /** The problem's details. */
  detail?: string | undefined
  /** The response that carried the problem. */
  response?: AxiosResponse | undefined
}

/** A problem response (`type` and `status` in its body) from the App API. Its message is one to show the user. */
export class SaladError extends Error {
  /** The HTTP status code. */
  public readonly status: number
  /** The problem type, such as `rewards:outOfStock`. */
  public readonly type: string
  /** The problem's title. */
  public readonly title: string | undefined
  /** The problem's details. */
  public readonly detail: string | undefined
  /** The response that carried the problem. */
  public readonly response: AxiosResponse | undefined

  public constructor({ status, type, title, detail, response }: Problem) {
    super(messageOf(type))
    this.name = 'SaladError'
    this.status = status
    this.type = type
    this.title = title
    this.detail = detail
    this.response = response
  }
}
