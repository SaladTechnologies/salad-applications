import type { AxiosInstance, AxiosResponse } from 'axios'
import Axios from 'axios'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { action, observable } from 'mobx'
import { SaladError } from '../../axiosFactory'
import { ErrorPageType } from '../../UIStore'
import type { AnalyticsStore } from '../analytics'
import type { AuthStore } from '../auth'
import type { NativeStore } from '../machine'
import type { AntiVirusSoftware } from './models'
import { antivirusInfo, getAntiVirusSoftware, getZendeskAVData } from './utils'

const defaultBeaconId = '29fdaae4-715f-48dc-b93e-5552ef031abc'

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
  public antiVirusArticleList?: typeof antivirusInfo

  @observable
  public errorType: ErrorPageType = ErrorPageType.Unknown

  @observable helpScoutUrl?: string

  @observable helpScoutFirewallArticle?: string

  private readonly useZendesk: boolean

  constructor(
    private readonly axios: AxiosInstance,
    private readonly auth: AuthStore,
    private readonly native: NativeStore,
    private readonly analytics: AnalyticsStore,
  ) {
    this.useZendesk = false
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
        let response = await this.axios.post<never, AxiosResponse<{ token: string }>>(`/api/v2/zendesk-tokens/chat`)
        jwtToken = response.data.token
      } catch (e) {
        if (Axios.isAxiosError(e) || e instanceof SaladError) {
          if (e.response == null || e.response.status !== 404) {
            this.chatAuthRetryTimeout = setTimeout(() => {
              window.zE!('webWidget', 'chat:reauthenticate')
            }, 30000)
          }
        } else {
          throw e
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
        let response = await this.axios.post<never, AxiosResponse<{ token: string }>>(
          `/api/v2/zendesk-tokens/help-center`,
        )
        jwtToken = response.data.token
      } catch (e) {
        if (Axios.isAxiosError(e) || e instanceof SaladError) {
          if (e.response == null || e.response.status !== 404) {
            this.helpCenterAuthRetryTimeout = setTimeout(() => {
              window.zE!('webWidget', 'helpCenter:reauthenticate')
            }, 30000)
          }
        } else {
          throw e
        }
      }
    }

    return jwtToken
  }

  private async getSignature(beaconId: string): Promise<string | undefined> {
    let signature: string | null | undefined
    if (this.auth.isAuthenticated) {
      let response = await this.axios.post<never, AxiosResponse<{ signature: string | null | undefined }>>(
        `/api/v2/help-scout-signatures?beaconId=${beaconId}`,
      )
      signature = response.data.signature
    }

    return signature || undefined
  }

  private inject() {
    if (typeof window !== 'undefined') {
      if (Zendesk.injected) {
        return
      }

      if (this.useZendesk) {
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
              theme: '#DBF1C1',
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
      } else {
        // Append Help Scout script to body.
        /* eslint-disable */
        /* prettier-ignore */
        /* @ts-ignore */
        !function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});
        /* prettier-ignore */
        /* @ts-ignore */
        window.Beacon('init', defaultBeaconId);
        /* eslint-enable */
      }

      Zendesk.injected = true
    }
  }

  async login(username: string, email: string) {
    if (this.useZendesk) {
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
    } else {
      if (window.Beacon) {
        window.Beacon('identify', { name: username, email, signature: await this.getSignature(defaultBeaconId) })
      }
    }
  }

  logout() {
    if (this.useZendesk) {
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
    } else {
      if (window.Beacon) {
        window.Beacon('reset')
        window.Beacon('logout', { endActiveChat: true })
      }
    }
  }

  openSupportTicket() {
    if (!this.useZendesk) {
      return
    }

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

  private setErrorType = (errorType: ErrorPageType) => {
    this.errorType = errorType
  }

  @action.bound
  loadArticle = function (this: Zendesk, articleID: number) {
    this.setErrorType(ErrorPageType.AntiVirus)
    const avSoftwareName = getZendeskAVData(articleID).name
    this.selectedAntiVirusGuide = avSoftwareName
    this.helpScoutUrl = getZendeskAVData(articleID).helpScoutUrl
  }.bind(this)

  @action.bound
  loadAntiVirusArticleList = function (this: Zendesk) {
    this.setErrorType(ErrorPageType.AntiVirus)
    this.antiVirusArticleList = antivirusInfo
    this.analytics.trackErrorPageViewed('Generic Anti-Virus Error')
  }.bind(this)

  @action.bound
  loadFirewallArticle = function (this: Zendesk) {
    this.setErrorType(ErrorPageType.Firewall)
    this.analytics.trackErrorPageViewed('Firewall Error')
    this.helpScoutFirewallArticle = `https://support.salad.com/article/219-whitelisting-salad-in-your-firewall`
  }.bind(this)
}
