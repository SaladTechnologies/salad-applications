declare module 'post-robot' {
  export interface Cancelable {
    cancel: () => void
  }

  export type DomainMatcher = string | string[] | ReadonlyArray<string> | RegExp

  export type ErrorHandlerType = (err: any) => void

  export type FireAndForgetClientOptionsType = {
    domain?: DomainMatcher
    fireAndForget?: true
    timeout?: number
  }

  export type HandlerType = (event: ResponseMessageEvent) => void | any | Promise<any>

  export type RegularClientOptionsType = {
    domain?: DomainMatcher
    fireAndForget?: false
    timeout?: number
  }

  export interface ResponseMessageEvent {
    source: Window
    origin: string
    data: any
  }

  export type ServerOptionsType = {
    domain?: DomainMatcher
    errorHandler?: ErrorHandlerType
    errorOnClose?: boolean
    handler?: HandlerType
    name?: string
    once?: boolean
    window?: Window
  }

  export function on(name: string, handler: HandlerType): Cancelable
  export function on(name: string, options: ServerOptionsType, handler?: HandlerType): Cancelable

  export function once(name: string, handler: HandlerType): Cancelable & Promise<ResponseMessageEvent>
  export function once(
    name: string,
    options: ServerOptionsType,
    handler?: HandlerType,
  ): Cancelable & Promise<ResponseMessageEvent>

  export function send(
    window: Window,
    name: string,
    data?: any,
    options?: RegularClientOptionsType,
  ): Promise<ResponseMessageEvent>
  export function send(
    window: Window,
    name: string,
    data?: any,
    options?: FireAndForgetClientOptionsType,
  ): Promise<void>
}
