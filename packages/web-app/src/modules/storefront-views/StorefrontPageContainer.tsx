import { useQuery } from '@tanstack/react-query'
import { useBanner } from '../../app/banner.ts'
import { useHttp } from '../../data/http-context.ts'
import type { StorefrontPageProps } from '../storefront/models'
import { config } from '../../config'
import { storefrontQuery } from '../../rewards/storefront.ts'
import { StorefrontPage } from './pages/StorefrontPage'

/** The storefront page, with the notification banner that the app-wide refresh loads. */
export const StorefrontPageContainer = () => {
  const http = useHttp()
  const { data } = useQuery(storefrontQuery(http, config.rewardRefreshRate))
  const bannerInfo = useBanner()
  return <StorefrontPage data={data as StorefrontPageProps} bannerInfo={bannerInfo} />
}
