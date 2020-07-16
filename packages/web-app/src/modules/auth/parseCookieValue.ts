export const parseCookieValue = (cookies: string, name: string): string | null => {
  name = encodeURIComponent(name)
  for (const cookie of cookies.split(';')) {
    const eqIndex = cookie.indexOf('=')
    const [cookieName, cookieValue]: string[] =
      eqIndex === -1 ? [cookie, ''] : [cookie.slice(0, eqIndex), cookie.slice(eqIndex + 1)]
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue)
    }
  }

  return null
}
