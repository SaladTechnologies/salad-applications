export const getCookieByName = (cookieName: string, cookies: string): string | undefined => {
  const cookiesCollection: Record<string, string> = {}
  cookies.split(';').forEach((cookie) => {
    const [name, value] = cookie.split('=')

    if (name && value) {
      cookiesCollection[name.trim()] = value
    }
  })
  return cookiesCollection[cookieName]
}

export const deleteCookieByName = (cookieName: string): void => {
  const expiredDateValue = 'Thu, 01 Jan 1970 00:00:00 UTC'
  document.cookie = `${cookieName}=; expires=${expiredDateValue}`
}

export enum UTMTag {
  Medium = 'utm_medium',
  Source = 'utm_source',
  Campaign = 'utm_campaign',
  Content = 'utm_content',
}

export const saveUTMTagsToCookies = (urlSearch: string, cookies: string): void => {
  const urlSearchParams = new URLSearchParams(urlSearch)
  const UTMTagsSet = new Set(Object.values(UTMTag) as string[])
  const filteredUTMParams = [...urlSearchParams].filter((urlSearchParam) => UTMTagsSet.has(urlSearchParam[0]))
  const maxExpirationCookieValue = 400 * 24 * 60 * 60

  filteredUTMParams.forEach(([name, value]) => {
    const isCookieExists = !!getCookieByName(name, cookies)
    if (isCookieExists) {
      return
    }

    document.cookie = `${name}=${value}; max-age=${maxExpirationCookieValue}; secure; samesite=lax`
  })
}
