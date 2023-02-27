// Import CSS. Order is important!
import './index.css'
import '@saladtechnologies/garden-fonts'
import 'react-hint/css/index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css'

// Import polyfills. Order is important!
import 'react-app-polyfill/stable'
import 'whatwg-fetch'
import 'abortcontroller-polyfill'
import 'url-polyfill'

import { DefaultTheme as JSSTheme } from './SaladTheme'
import { DefaultTheme as EmotionTheme } from '@saladtechnologies/garden-components'
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import { ThemeProvider as JSSThemeProvider } from 'react-jss'
import { SkeletonTheme } from 'react-loading-skeleton'

import ReactDOM from 'react-dom'
import { UpgradePage } from './components/UpgradePage'

//Adds a dummy window.salad for use in the web-app, this will be skipped in desktop-app
if (!window.salad) {
  window.salad = {
    platform: 'web',
    apiVersion: 100000000,
    // @ts-ignore
    dispatch: (type: string, payload: any) => {},
    // @ts-ignore
    onNative: (args: { type: string; payload: any }) => {},
  }
}

setTimeout(() => {
  const isNative =
    window.salad &&
    (window.salad.platform === 'electron' ||
      window.salad.platform === 'darwin' ||
      window.salad.platform === 'linux' ||
      window.salad.platform === 'win32')

  if (isNative) {
    ReactDOM.render(
      <EmotionThemeProvider theme={EmotionTheme}>
        <JSSThemeProvider theme={JSSTheme}>
          <SkeletonTheme baseColor="#172E40" highlightColor="#304759">
            <UpgradePage />
          </SkeletonTheme>
        </JSSThemeProvider>
      </EmotionThemeProvider>,

      document.getElementById('root'),
    )
    return
  }

  // in case running in browser: redirect to the modern web-app as a part of upgrade
  const baseUrl = window.location.href.includes('https://app.salad.io/')
    ? 'https://app.salad.io/'
    : 'http://localhost:3000/'

  const isStoreRedirect = window.location.href.includes('rewards') || window.location.href.includes('search')
  if (isStoreRedirect) {
    window.location.href = window.location.href.replace(baseUrl, 'https://salad.com/store/')
    return
  }

  const isSettingsRedirect = window.location.href.includes('settings')
  if (isSettingsRedirect) {
    window.location.href = window.location.href.replace(baseUrl + 'settings', 'https://salad.com/account')
    return
  }

  if (window.location.href.includes('earn/mine/miner-details')) {
    window.location.href = 'https://salad.com/earn/machine-settings'
    return
  }

  if (window.location.href.includes('earn/referrals')) {
    window.location.href = 'https://salad.com/account/referrals'
    return
  }

  if (baseUrl !== window.location.href) {
    window.location.href = window.location.href.replace(baseUrl, 'https://salad.com/')
    return
  }

  window.location.href = 'https://salad.com/store'
}, 0)
