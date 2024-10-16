import { useEffect } from 'react'

const defaultOgMetaTags = {
  url: window.location.href,
  type: 'website',
}

export const useAddOgMetaTags = (ogMetaTags: Record<string, string>) => {
  useEffect(() => {
    Object.keys({ ...ogMetaTags, ...defaultOgMetaTags }).forEach((ogMetaTagPropertyName) => {
      const ogMetaTag = document.querySelector(`meta[property='og:${ogMetaTagPropertyName}']`)
      const ogMetaTagContent = ogMetaTags[ogMetaTagPropertyName] as string

      if (ogMetaTag) {
        ogMetaTag.setAttribute('content', ogMetaTagContent)
      } else {
        const newOgMetaTag = document.createElement('meta')
        newOgMetaTag.setAttribute('property', `og:${ogMetaTagPropertyName}`)
        newOgMetaTag.setAttribute('content', ogMetaTagContent)
        document.head.appendChild(newOgMetaTag)
      }
    })
  }, [ogMetaTags])
}
