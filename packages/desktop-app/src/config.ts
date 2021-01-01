export const APP_URL =
  typeof process.env.ELECTRON_WEBPACK_APP_URL === 'string' && process.env.ELECTRON_WEBPACK_APP_URL.length > 0
    ? process.env.ELECTRON_WEBPACK_APP_URL
    : 'http://localhost:3000'
