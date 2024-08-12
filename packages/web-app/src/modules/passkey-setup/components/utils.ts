const getBrowserName = () => {
  if (navigator.userAgent.indexOf('Opera') !== -1 || navigator.userAgent.indexOf('OPR') !== -1) {
    return 'Opera'
    // @ts-ignore
  } else if (navigator.userAgent.indexOf('Edg') !== -1) {
    return 'Edge'
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
    return 'Chrome'
  } else if (navigator.userAgent.indexOf('Safari') !== -1) {
    return 'Safari'
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
    return 'Firefox'
    // @ts-ignore
  } else if (navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode === true) {
    //IF IE > 10
    return 'IE'
  } else {
    return 'Unknown Browser'
  }
}

const getOsName = () => {
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  let os = null

  if (platform.indexOf('Win') !== -1) {
    os = 'Windows'
  } else if (platform.indexOf('Mac') !== -1) {
    os = 'macOS'
  } else if (platform.indexOf('Linux') !== -1) {
    os = 'Linux'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    os = 'iOS'
  } else {
    os = 'Unknown OS'
  }

  return os
}

export const getDefaultPasskeyName = () => {
  return `${getBrowserName()} on ${getOsName()}`
}
