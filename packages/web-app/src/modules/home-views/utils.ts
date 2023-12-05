interface DetectedBrowsers {
  isChromeAgent: boolean
  isIOSChromeAgent: boolean
  isSafariAgent: boolean
  isStandalone: boolean
}

export const detectBrowser = (): DetectedBrowsers => {
  const isChromeAgent = navigator.userAgent.indexOf('Chrome') > -1
  const isIOSChromeAgent = navigator.userAgent.indexOf('CriOS') > -1
  const isSafariAgent = navigator.userAgent.indexOf('Safari') > -1 && !isChromeAgent
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  return {
    isChromeAgent,
    isIOSChromeAgent,
    isSafariAgent,
    isStandalone,
  }
}
