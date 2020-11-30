export interface ZendeskWidget {
  (type: 'webWidget:on' | 'webWidget' | 'webWidget:get', command: string, payload?: any): void
  (type: 'webWidget', command: 'updateSettings', payload: ZendeskSettings): void
  logout(): void
}

export interface ZendeskUIString {
  [locale: string]: string
}

export interface ZendeskField {
  id: string | number
  prefill: ZendeskUIString
}

export interface ZendeskSettings {
  analytics?: boolean
  cookies?: boolean
  errorReporting?: boolean
  webWidget?: {
    answerBot?: {
      avatar?: {
        url: string
        name: ZendeskUIString
      }
      suppress?: boolean
      title?: ZendeskUIString
      contactOnlyAfterQuery?: boolean
      search?: {
        labels: string[]
      }
    }
    authenticate?: {
      chat?: {
        jwtFn: (callback: (jwtToken: string) => void) => void
      }
      jwtFn?: (callback: (jwtToken: string) => void) => void
    }
    contactForm?: {
      attachments?: boolean
      fields?: ZendeskField[]
      selectTicketForm?: ZendeskUIString
      subject?: boolean
      suppress?: boolean
      title?: ZendeskUIString
      ticketForms?: Array<{ id: number; fields?: ZendeskField[] }>
    }
    contactOptions?: {
      enabled?: boolean
      contactButton?: ZendeskUIString
      contactFormLabel?: ZendeskUIString
      chatLabelOnline?: ZendeskUIString
      chatLabelOffline?: ZendeskUIString
    }
    chat?: {
      concierge?: {
        avatarPath: string
        name: string
        title: ZendeskUIString
      }
      departments?: {
        enabled: string[]
        select?: string
      }
      hideWhenOffline?: boolean
      menuOptions?: {
        emailTranscript?: boolean
      }
      notifications?: {
        mobile?: {
          disable?: boolean
        }
      }
      offlineForm?: {
        greeting?: ZendeskUIString
      }
      prechatForm?: {
        greeting?: ZendeskUIString
        departmentLabel?: ZendeskUIString
      }
      profileCard?: {
        avatar?: boolean
        rating?: boolean
        title?: boolean
      }
      suppress?: boolean
      tags?: string
      title?: ZendeskUIString
    }
    color?: {
      theme?: string
      launcher?: string
      launcherText?: string
      button?: string
      resultLists?: string
      header?: string
      articleLinks?: string
    }
    helpCenter?: {
      messageButton?: ZendeskUIString
      originalArticleButton?: boolean
      searchPlaceholder?: ZendeskUIString
      suppress?: boolean
      title?: ZendeskUIString
      chatButton?: ZendeskUIString
      filter?: {
        category?: string
        section?: string
        label_names?: string
      }
    }
    launcher?: {
      label?: ZendeskUIString
      mobile?: {
        labelVisible?: boolean
      }
      badge?: {
        label?: ZendeskUIString
        image?: string
        layout?: 'image_right' | 'image_left' | 'image_only' | 'text_only'
      }
      chatLabel?: ZendeskUIString
    }
    navigation?: {
      popoutButton?: {
        enabled?: boolean
      }
    }
    offset?: {
      horizontal?: string
      vertical?: string
      mobile?: {
        horizontal?: string
        vertical?: string
      }
    }
    position?: {
      horizontal: 'left' | 'right'
      vertical: 'top' | 'bottom'
    }
    talk?: {
      nickname?: string
      suppress?: boolean
      title?: ZendeskUIString
    }
    zIndex?: number
  }
}

declare global {
  interface Window {
    zESettings?: ZendeskSettings
    zE?: ZendeskWidget
  }
}
