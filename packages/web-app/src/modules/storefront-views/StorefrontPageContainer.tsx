import { useQuery } from '@tanstack/react-query'
import { useHttp } from '../../data/http-context.ts'
import type { StorefrontPageProps } from '../storefront/models'
import { config } from '../../config'
import { storefrontQuery } from '../../rewards/storefront.ts'
import { StorefrontPage } from './pages/StorefrontPage'

/** The storefront page. */
export const StorefrontPageContainer = () => {
  const http = useHttp()
  const { data } = useQuery(storefrontQuery(http, config.rewardRefreshRate))
  return <StorefrontPage data={data as StorefrontPageProps} />
}
