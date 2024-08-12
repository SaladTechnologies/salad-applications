const getBrowserName = () => {
  switch (true) {
    case navigator.userAgent.indexOf('Opera') !== -1 || navigator.userAgent.indexOf('OPR') !== -1:
      return 'Opera'

    case navigator.userAgent.indexOf('Edg') !== -1:
      return 'Edge'

    case navigator.userAgent.indexOf('Chrome') !== -1:
      return 'Chrome'

    case navigator.userAgent.indexOf('Safari') !== -1:
      return 'Safari'

    case navigator.userAgent.indexOf('Firefox') !== -1:
      return 'Firefox'

    // @ts-ignore
    case navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode === true:
      return 'IE'

    default:
      return 'Unknown Browser'
  }
}

const getOsName = () => {
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform

  switch (true) {
    case platform.indexOf('Win') !== -1:
      return 'Windows'

    case platform.indexOf('Mac') !== -1:
      return 'macOS'

    case platform.indexOf('Linux') !== -1:
      return 'macOS'

    case /Android/.test(userAgent):
      return 'Android'

    case /iPhone|iPad|iPod/.test(userAgent):
      return 'iOS'

    default:
      return 'Unknown OS'
  }
}

export const getDefaultPasskeyName = () => {
  return `${getBrowserName()} on ${getOsName()}`
}
