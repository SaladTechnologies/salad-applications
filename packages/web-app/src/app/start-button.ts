/** The navigation bar's start button. */
export interface StartButton {
  /** The button's text. */
  label: string
  /** What a click does. */
  onClick: () => void
}

/** Where the Salad desktop app downloads from. */
const downloadUrl = 'https://salad.com/download'

/**
 * Returns the navigation bar's start button: "Login" (which runs `onLogin`) when signed out, and "Download" (which
 * opens the desktop app's download page in a new tab) when signed in. `isAuthenticated` is `undefined` while the
 * session is unknown, which shows "Login".
 */
export const startButton = (isAuthenticated: boolean | undefined, onLogin: () => void): StartButton =>
  isAuthenticated === true
    ? {
        label: 'Download',
        onClick: () => {
          globalThis.open(downloadUrl, '_blank')
        },
      }
    : { label: 'Login', onClick: onLogin }
