import { Ref } from 'react'

declare function Beacon(method: 'init', beaconId: string): void
declare function Beacon(method: 'destroy'): void
declare function Beacon(method: 'open'): void
declare function Beacon(method: 'close'): void
declare function Beacon(method: 'toggle'): void
declare function Beacon(method: 'search', query: string): void
declare function Beacon(method: 'suggest'): void
declare function Beacon(method: 'article', articleId: string, options?: { type: 'modal' | 'sidebar' }): void
declare function Beacon(method: 'navigate', route: string): void
declare function Beacon(method: 'identify', userObject: { name: string; email: string; signature?: string }): void
declare function Beacon(method: 'prefill', formObject: {}): void
declare function Beacon(method: 'reset'): void
declare function Beacon(method: 'logout', options?: { endActiveChat: true }): void
declare function Beacon(method: 'config', formObject: {}): void
declare function Beacon(method: 'info'): void

declare global {
  interface Window {
    Beacon?: typeof Beacon
    // https://support.trustpilot.com/hc/en-us/articles/115011421468--Add-a-TrustBox-to-a-single-page-application
    Trustpilot?: {
      loadFromElement: (ref: Ref<any>, flag: boolean) => void
    }
  }
}
