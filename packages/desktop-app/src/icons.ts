import path from 'path'
import process from 'process'

declare const __static: string

export const LOGO_PATH = path.join(__static, process.platform === 'win32' ? 'logo.ico' : 'logo.png')

export const LOGO_ANIMATED_PATH = path.join(__static, 'logo.gif')

export const TRAY_ICON_PATH = LOGO_PATH

export const TRAY_ACTIVE_ICON_PATH = path.join(
  __static,
  process.platform === 'win32' ? 'logo-active.ico' : 'logo-active.png',
)

export const TRAY_ALERT_ICON_PATH = path.join(
  __static,
  process.platform === 'win32' ? 'logo-alert.ico' : 'logo-alert.png',
)

// [Placeholder] For MacOS Dock
export const DOCK_LOGO_ACTIVE_PATH = path.join(__static, 'logo-active.png')
// [Placeholder] For MacOS Dock
export const DOCK_LOGO_ALERT_PATH = path.join(__static, 'logo-alert.png')

export const TAKSBAR_ACTIVE_OVERLAY_ICON_PATH = path.join(__static, 'taskbar-overlay-active.png')

export const NOTIFICATION_ICON_PATH = path.join(__static, 'logo.png')
