import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AntiVirusErrorPage } from './components/AntiVirusErrorPage'

const mapStoreToProps = (store: RootStore): any => ({
  onCloseClicked: () => store.ui.hideModal(),
  avLinks: [
    {
      url: 'https://support.salad.io/hc/en-us/sections/360008458292-Anti-Virus',
      text: 'Anti-Virus Configuration Guides',
    },
  ],
})

export const AntiVirusErrorContainer = connect(mapStoreToProps, AntiVirusErrorPage)
