import { useEffect } from 'react'

export const useOgMetaTags = (ogMetaTagsRecord: Record<string, string>) => {
  useEffect(() => {
    Object.keys(ogMetaTagsRecord).forEach((ogMetaTagPropertyName) => {
      const ogMetaTag = document.querySelector(`meta[property='og:${ogMetaTagPropertyName}']`)
      const ogMetaTagContent = ogMetaTagsRecord[ogMetaTagPropertyName] as string

      if (ogMetaTag) {
        ogMetaTag.setAttribute('content', ogMetaTagContent)
      } else {
        const newOgMetaTag = document.createElement('meta')
        newOgMetaTag.setAttribute('property', `og:${ogMetaTagPropertyName}`)
        newOgMetaTag.setAttribute('content', ogMetaTagContent)
        document.head.appendChild(newOgMetaTag)
      }
    })
  }, [ogMetaTagsRecord])
}
