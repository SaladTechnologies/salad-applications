import { FetchRequestAdapter, HttpClient } from '@microsoft/kiota-http-fetchlibrary'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { config } from '../../config'
import type { MachinesApiClient } from './generated/machinesApiClient'
import { createMachinesApiClient } from './generated/machinesApiClient'

const apiUrl = `${config.apiBaseUrl}/api`

const convertAxiosResponseToFetchResponse = <T = any>(axiosResponse: AxiosResponse<T>): Response => {
  const fetchResponse = {
    ok: axiosResponse.status >= 200 && axiosResponse.status < 300,
    status: axiosResponse.status,
    statusText: axiosResponse.statusText,
    headers: new Headers(axiosResponse.headers as Record<string, string>),
    url: axiosResponse.config.url || '',
    redirected: false,
    type: 'basic' as ResponseType,
    bodyUsed: false,
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(axiosResponse.data)
        controller.close()
      },
    }),
    async json() {
      if (this.bodyUsed) throw new TypeError('Already read')
      this.bodyUsed = true
      return axiosResponse.data
    },
    async text() {
      if (this.bodyUsed) throw new TypeError('Already read')
      this.bodyUsed = true
      return JSON.stringify(axiosResponse.data)
    },
    async blob() {
      if (this.bodyUsed) throw new TypeError('Already read')
      this.bodyUsed = true
      const data = JSON.stringify(axiosResponse.data)
      return new Blob([data], { type: 'application/json' })
    },
    async arrayBuffer() {
      if (this.bodyUsed) throw new TypeError('Already read')
      this.bodyUsed = true
      const data = JSON.stringify(axiosResponse.data)
      const buffer = new ArrayBuffer(data.length)
      const view = new Uint8Array(buffer)
      for (let i = 0; i < data.length; i++) {
        view[i] = data.charCodeAt(i)
      }
      return buffer
    },
    async bytes() {
      if (this.bodyUsed) throw new TypeError('Already read');
      this.bodyUsed = true;
      const data = JSON.stringify(axiosResponse.data);
      const uint8Array = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        uint8Array[i] = data.charCodeAt(i);
      }
      return uint8Array;
    },
    async formData() {
      if (this.bodyUsed) throw new TypeError('Already read')
      this.bodyUsed = true
      const formData = new FormData()
      const json = axiosResponse.data as Record<string, any>
      if (typeof json === 'object') {
        Object.keys(json).forEach((key) => formData.append(key, json[key]))
      }
      return formData
    },
    clone() {
      return convertAxiosResponseToFetchResponse(axiosResponse)
    },
  }

  return fetchResponse
}

class AuthenticationProviderStub {
  authenticateRequest = () => Promise.resolve()
}

export const getMachinesApiClient = (axios: AxiosInstance): MachinesApiClient => {
  const httpClient = new HttpClient((request: string, init: RequestInit) => {
    return axios.request({ url: request, method: init.method }).then((response) => {
      return convertAxiosResponseToFetchResponse(response)
    })
  })

  const requestAdapter = new FetchRequestAdapter(new AuthenticationProviderStub(), undefined, undefined, httpClient)

  requestAdapter.baseUrl = apiUrl
  return createMachinesApiClient(requestAdapter)
}
