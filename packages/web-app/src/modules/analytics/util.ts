import { getCookie } from "../../utils"

export const getUtmTagsFromCookie = (): Record<string, string>  => {
  const mixpanelCookie = JSON.parse(getCookie('mp_68db9194f229525012624f3cf368921f_mixpanel') ?? '{}')
  const utmTagsKeys = Object.keys(mixpanelCookie).filter((key: string) => key.startsWith('utm_'))

  return utmTagsKeys.reduce<Record<string, string>>((acc, key) => {
    // Transform keys by removing underscores because Mixpanel does not support keys in snake case.
    const normalizedKey = key.replace('_', '')
    if (mixpanelCookie[key]) {
      acc[normalizedKey] = mixpanelCookie[key]
    }
    return acc
  }, {})
}
