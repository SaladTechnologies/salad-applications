import { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { ErrorPageType } from '../../UIStore'
import { AnalyticsStore } from '../analytics'
import { AuthStore } from '../auth'
import { NativeStore } from '../machine'
import { AntiVirusSoftware, ZendeskArticle, ZendeskArticleList, ZendeskArticleResource } from './models'
import { getAntiVirusSoftware, getZendeskAVData } from './utils'

export class Zendesk {
  private static injected: boolean = false

  private static injectionError: boolean = false

  private chatAuthRetryTimeout?: NodeJS.Timeout

  private helpCenterAuthRetryTimeout?: NodeJS.Timeout

  private initializeRetryTimeout?: NodeJS.Timeout

  private detectedAntiVirus?: AntiVirusSoftware

  @observable
  public selectedAntiVirusGuide?: AntiVirusSoftware

  @observable
  public helpCenterArticle?: string

  @observable
  public loadingArticle: boolean = false

  @observable
  public antiVirusArticleList?: ZendeskArticle[]

  @observable
  public errorType: ErrorPageType = ErrorPageType.Unknown

  constructor(
    private readonly axios: AxiosInstance,
    private readonly auth: AuthStore,
    private readonly native: NativeStore,
    private readonly analytics: AnalyticsStore,
  ) {
    this.inject()
  }

  private async getChatToken(): Promise<string | undefined> {
    if (this.chatAuthRetryTimeout) {
      clearTimeout(this.chatAuthRetryTimeout)
      this.chatAuthRetryTimeout = undefined
    }

    let jwtToken: string | undefined
    if (this.auth.isAuthenticated) {
      try {
        let response = await this.axios.post(`/api/v2/zendesk-tokens/chat`)
        jwtToken = response.data.token
      } catch (e) {
        if (e.response == null || e.response.status !== 404) {
          this.chatAuthRetryTimeout = setTimeout(() => {
            window.zE!('webWidget', 'chat:reauthenticate')
          }, 30000)
        }
      }
    }

    return jwtToken
  }

  private async getHelpCenterToken(): Promise<string | undefined> {
    if (this.helpCenterAuthRetryTimeout) {
      clearTimeout(this.helpCenterAuthRetryTimeout)
      this.helpCenterAuthRetryTimeout = undefined
    }

    let jwtToken: string | undefined
    if (this.auth.isAuthenticated) {
      try {
        let response = await this.axios.post(`/api/v2/zendesk-tokens/help-center`)
        jwtToken = response.data.token
      } catch (e) {
        if (e.response == null || e.response.status !== 404) {
          this.helpCenterAuthRetryTimeout = setTimeout(() => {
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
            chat: {
              jwtFn: async (callback) => {
                const jwtToken = await this.getChatToken()
                if (jwtToken) {
                  callback(jwtToken)
                }
              },
            },
            jwtFn: async (callback) => {
              const jwtToken = await this.getHelpCenterToken()
              if (jwtToken) {
                callback(jwtToken)
              }
            },
          },
          chat: {
            title: {
              '*': 'Live Chat',
            },
            menuOptions: {
              emailTranscript: false,
            },
            notifications: {
              mobile: {
                disable: true,
              },
            },
            profileCard: {
              avatar: true,
              rating: false,
              title: true,
            },
          },
          contactForm: {
            title: {
              '*': 'Support Ticket',
            },
            attachments: true,
          },
          contactOptions: {
            enabled: true,
            contactButton: {
              '*': 'Contact Us',
            },
            chatLabelOnline: {
              '*': 'Live Chat',
            },
            chatLabelOffline: {
              '*': 'Live Chat (Offline)',
            },
            contactFormLabel: {
              '*': 'Support Ticket',
            },
          },
          helpCenter: {
            title: {
              '*': 'Support',
            },
            originalArticleButton: false,
          },
          navigation: {
            popoutButton: {
              enabled: false,
            },
          },
          offset: {
            mobile: {
              horizontal: '-530px',
              vertical: '-100px',
            },
          },
          color: {
            theme: '#B2D530',
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

    let initialized = true

    // Initialize contact form.
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
      console.error('Failed to prefill Zendesk contact form')
      console.error(e)
      initialized = false
    }

    // Initialize chat.
    try {
      window.zE('webWidget', 'chat:reauthenticate')
    } catch (e) {
      console.error('Failed to authenticate Zendesk chat')
      console.error(e)
      initialized = false
    }

    // Initialize help center.
    try {
      window.zE('webWidget', 'helpCenter:reauthenticate')
    } catch (e) {
      console.error('Unable to authenticate Zendesk help center')
      console.error(e)
      initialized = false
    }

    if (initialized && this.initializeRetryTimeout !== undefined) {
      clearTimeout(this.initializeRetryTimeout)
      this.initializeRetryTimeout = undefined
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

    if (this.chatAuthRetryTimeout) {
      clearTimeout(this.chatAuthRetryTimeout)
      this.chatAuthRetryTimeout = undefined
    }

    if (this.helpCenterAuthRetryTimeout) {
      clearTimeout(this.helpCenterAuthRetryTimeout)
      this.helpCenterAuthRetryTimeout = undefined
    }

    try {
      if (typeof window.zE.logout === 'function') {
        window.zE.logout()
      } else {
        window.zE('webWidget', 'logout')
      }

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

  @action
  setErrorType = (errorType: ErrorPageType) => {
    this.errorType = errorType
  }

  @action.bound
  loadArticle = flow(
    function* (this: Zendesk, articleID: number) {
      this.setErrorType(ErrorPageType.AntiVirus)
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
      this.setErrorType(ErrorPageType.AntiVirus)
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

  @action.bound
  loadFirewallArticle = flow(
    function* (this: Zendesk) {
      this.setErrorType(ErrorPageType.Firewall)
      this.loadingArticle = true
      try {
        let res: Response = yield fetch('https://salad.zendesk.com/api/v2/help_center/en-us/articles/360058674291', {
          credentials: 'omit',
        })
        const data: ZendeskArticleResource = yield res.json()
        this.helpCenterArticle = data.article.body
      } catch (err) {
        throw err
      }
      this.loadingArticle = false
    }.bind(this),
  )
}
