import { useEffect } from 'react'

const defaultOgMetaTags: Record<string, string> = {
  url: window.location.href,
  type: 'website',
  image: `${window.location.origin}/og-official-store.png`,
  'image:alt': 'Salad',
}

export const useAddOgMetaTags = (ogMetaTags: Record<string, string>) => {
  useEffect(() => {
    const combinedOgMetaTags = { ...defaultOgMetaTags, ...ogMetaTags }
    Object.keys(combinedOgMetaTags).forEach((ogMetaTagPropertyName) => {
      const ogMetaTag = document.querySelector(`meta[property='og:${ogMetaTagPropertyName}']`)
      const ogMetaTagContent = combinedOgMetaTags[ogMetaTagPropertyName] as string

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
