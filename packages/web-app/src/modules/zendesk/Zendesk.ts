import { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { AnalyticsStore } from '../analytics'
import { AuthStore } from '../auth'
import { NativeStore } from '../machine'
import { AntiVirusSoftware, ZendeskArticle, ZendeskArticleList, ZendeskArticleResource } from './models'
import { getAntiVirusSoftware, getZendeskAVData } from './utils'

export class Zendesk {
  private static injected: boolean = false
  private static injectionError: boolean = false
  private initializeRetryTimeout?: NodeJS.Timeout
  private reauthenticateRetryTimeout?: NodeJS.Timeout

  private detectedAntiVirus?: AntiVirusSoftware

  @observable
  public selectedAntiVirusGuide?: AntiVirusSoftware

  @observable
  public helpCenterArticle?: string

  @observable
  public loadingArticle: boolean = false

  @observable
  public antiVirusArticleList?: ZendeskArticle[]

  constructor(
    private readonly axios: AxiosInstance,
    private readonly auth: AuthStore,
    private readonly native: NativeStore,
    private readonly analytics: AnalyticsStore,
  ) {
    this.inject()
  }

  private async getJWTToken(): Promise<string | undefined> {
    if (this.reauthenticateRetryTimeout) {
      clearTimeout(this.reauthenticateRetryTimeout)
      this.reauthenticateRetryTimeout = undefined
    }

    let jwtToken: string | undefined
    if (this.auth.isAuthenticated) {
      try {
        let response = await this.axios.post(`/api/v2/zendesk-tokens`)
        jwtToken = response.data.token
      } catch (e) {
        if (e.response == null || e.response.status !== 404) {
          this.reauthenticateRetryTimeout = setTimeout(() => {
            window.zE!('webWidget', 'helpCenter:reauthenticate')
          }, 30000)
        }
      }
    }

    return jwtToken
  }

  private inject() {
    if (typeof window !== 'undefined') {
      if (Zendesk.injected) {
        return
      }

      // Add `zESettings` before injecting the Zendesk script.
      window.zESettings = {
        webWidget: {
          authenticate: {
            jwtFn: async (callback) => {
              const jwtToken = await this.getJWTToken()
              if (jwtToken) {
                callback(jwtToken)
              }
            },
          },
          offset: {
            mobile: {
              horizontal: '-530px',
              vertical: '-100px',
            },
          },
        },
      }

      // Append Zendesk script to body.
      const zendeskSnippetScript = document.createElement('script')
      zendeskSnippetScript.async = true
      zendeskSnippetScript.onerror = () => {
        Zendesk.injectionError = true
      }
      zendeskSnippetScript.id = 'ze-snippet'
      zendeskSnippetScript.src = 'https://static.zdassets.com/ekr/snippet.js?key=36be7184-2a3f-4bec-9bb2-758e7c9036d0'
      document.body.appendChild(zendeskSnippetScript)

      Zendesk.injected = true
    }
  }

  login(username: string, email: string) {
    if (!window.zE) {
      if (this.initializeRetryTimeout !== undefined) {
        clearTimeout(this.initializeRetryTimeout)
        this.initializeRetryTimeout = undefined
      }

      if (!Zendesk.injectionError) {
        this.initializeRetryTimeout = setTimeout(() => {
          this.initializeRetryTimeout = undefined
          this.login(username, email)
        }, 1000)
      }

      return
    }

    try {
      window.zE('webWidget', 'prefill', {
        name: {
          value: username,
          readOnly: true,
        },
        email: {
          value: email.toLocaleLowerCase(),
          readOnly: true,
        },
      })
    } catch (e) {
      console.error('Unable to prefill Zendesk')
      console.error(e)
    }

    try {
      window.zE('webWidget', 'helpCenter:reauthenticate')
      if (this.initializeRetryTimeout !== undefined) {
        clearTimeout(this.initializeRetryTimeout)
        this.initializeRetryTimeout = undefined
      }
    } catch (e) {
      console.log('Unable to authenticate Zendesk web widget')
      console.log(e)
    }
  }

  logout() {
    if (!window.zE) {
      if (this.initializeRetryTimeout !== undefined) {
        clearTimeout(this.initializeRetryTimeout)
        this.initializeRetryTimeout = undefined
      }

      if (!Zendesk.injectionError) {
        this.initializeRetryTimeout = setTimeout(() => {
          this.initializeRetryTimeout = undefined
          this.logout()
        }, 1000)
      }

      return
    }

    if (this.reauthenticateRetryTimeout) {
      clearTimeout(this.reauthenticateRetryTimeout)
      this.reauthenticateRetryTimeout = undefined
    }

    try {
      window.zE.logout()
      if (this.initializeRetryTimeout !== undefined) {
        clearTimeout(this.initializeRetryTimeout)
        this.initializeRetryTimeout = undefined
      }
    } catch (e) {
      console.error('Unable to logout of Zendesk')
      console.error(e)
    }
  }

  openSupportTicket() {
    this.analytics.trackButtonClicked('opened_support_ticket_widget', 'Opened Support Ticket Widget', 'enabled')
    if (window && window.zE) {
      try {
        // Don't skip the Help Center every time...
        window.zE('webWidget:on', 'close', () => {
          window &&
            window.zE &&
            window.zE('webWidget', 'updateSettings', {
              webWidget: {
                helpCenter: {
                  suppress: false,
                },
              },
            })
        })

        // But skip the Help Center this time.
        window.zE('webWidget', 'updateSettings', {
          webWidget: {
            helpCenter: {
              suppress: true,
            },
          },
        })

        // Show the contact form!
        window.zE('webWidget', 'open')
      } catch (e) {
        console.log(e)
      }
    }
  }

  public get detectedAV() {
    if (this.detectedAntiVirus === undefined) {
      this.detectedAntiVirus =
        this.native.machineInfo?.processes && getAntiVirusSoftware(this.native.machineInfo?.processes)
    }

    return this.detectedAntiVirus
  }

  @action.bound
  loadArticle = flow(
    function* (this: Zendesk, articleID: number) {
      const avSoftwareName = getZendeskAVData(articleID).name
      if (avSoftwareName === this.selectedAntiVirusGuide && this.helpCenterArticle !== undefined) {
        return
      }

      this.loadingArticle = true
      try {
        let res: Response = yield fetch(`https://salad.zendesk.com/api/v2/help_center/en-us/articles/${articleID}`, {
          credentials: 'omit',
        })
        const data: ZendeskArticleResource = yield res.json()
        this.helpCenterArticle = data.article.body
        this.selectedAntiVirusGuide = avSoftwareName
      } catch (err) {
        throw err
      }
      this.loadingArticle = false
    }.bind(this),
  )

  @action.bound
  loadAntiVirusArticleList = flow(
    function* (this: Zendesk) {
      if (this.antiVirusArticleList !== undefined) {
        return
      }

      this.loadingArticle = true
      try {
        let res: Response = yield fetch(
          'https://salad.zendesk.com/api/v2/help_center/en-us/sections/360008458292/articles',
          {
            credentials: 'omit',
          },
        )
        const data: ZendeskArticleList = yield res.json()
        this.antiVirusArticleList = data.articles
      } catch (err) {
        throw err
      }
      this.loadingArticle = false
    }.bind(this),
  )
}
