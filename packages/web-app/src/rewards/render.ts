import type { AxiosInstance } from 'axios'

/** The query key of the live RENDER/USD price quote. */
export const renderExchangeRateQueryKey = ['render', 'exchange-rate'] as const

/** How often the RENDER quote refreshes while a RENDER reward is shown: every 30 seconds, as quotes are time-sensitive. */
export const renderExchangeRateRefreshRate = 30 * 1000

/**
 * Fetches the current RENDER/USD quote from the App API, as the API returned it. The App API is the only source of the
 * price; the app does no price discovery of its own.
 */
export const fetchRenderExchangeRate = async (http: AxiosInstance): Promise<unknown> => {
  const response = await http.get<unknown>('/api/v2/render/exchange-rate')
  return response.data
}
