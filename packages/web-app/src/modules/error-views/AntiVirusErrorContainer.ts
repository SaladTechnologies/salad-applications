import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AntiVirusErrorPage } from './components/AntiVirusErrorPage'

const mapStoreToProps = (store: RootStore): any => {
  type LinkList = { url: string; text: string }
  const avLinks: LinkList[] = [
    {
      url: 'https://salad.zendesk.com/hc/en-us/articles/360032211151-How-to-Whitelist-Salad-in-Norton-Antivirus',
      text: 'Norton',
    },
    {
      url: 'https://salad.zendesk.com/hc/en-us/articles/360031870772-How-to-Whitelist-Salad-in-Malwarebytes',
      text: 'Malwarebytes',
    },
    {
      url: 'https://salad.zendesk.com/hc/en-us/articles/360033488451-How-to-Whitelist-Salad-in-Panda',
      text: 'Panda',
    },
    {
      url: 'https://salad.zendesk.com/hc/en-us/articles/360033487651-How-to-Whitelist-Salad-in-Kaspersky',
      text: 'Kaspersky',
    },
    {
      url: 'https://salad.zendesk.com/hc/en-us/articles/360033488271-How-to-whitelist-Salad-in-McAfee',
      text: 'McAfee',
    },
    {
      url:
        'https://salad.zendesk.com/hc/en-us/articles/360033488151-How-to-Whitelist-Salad-in-Bitdefender-Antivirus-PLUS',
      text: 'Bitdefender',
    },
    {
      url: 'https://salad.zendesk.com/hc/en-us/articles/360033124692-How-to-Whitelist-Salad-in-Windows-Defender',
      text: 'Windows Defender',
    },
    {
      url: 'https://salad.zendesk.com/hc/en-us/articles/360033487211-How-to-Whitelist-Salad-in-Avast-Antivirus',
      text: 'Avast',
    },
  ]

  return {
    onCloseClicked: () => store.ui.hideModal(),
    onSendLog: store.native.sendLog,
    showSendLog: store.native.canSendLogs,
    avLinks: avLinks,
  }
}

export const AntiVirusErrorContainer = connect(mapStoreToProps, AntiVirusErrorPage)
