import { Ref } from 'react'

declare global {
  interface Window {
    // https://support.trustpilot.com/hc/en-us/articles/115011421468--Add-a-TrustBox-to-a-single-page-application
    Trustpilot?: {
      loadFromElement: (ref: Ref<any>, flag: boolean) => void
    }
  }
}
