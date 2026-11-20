import type { AxiosInstance } from 'axios'

/** The query key of a reward's details. */
export const rewardQueryKey = (id: string) => ['rewards', id] as const

/** Fetches a reward's details from the App API, as the API returned them (a reward resource). */
export const fetchRewardResource = async (http: AxiosInstance, id: string): Promise<unknown> => {
  const response = await http.get<unknown>(`/api/v1/rewards/${id}`)
  return response.data
}
