import { BottomBar } from './components/BottomBar'
import { connect } from '../../connect'
import { Config } from '../../config'
import { RootStore } from '../../Store';


const handleDiscord = () => {
  openLink(Config.discordUrl)
}

const handleSupport = () => {
  openLink(Config.supportUrl)
}

const handleVersion = () => {
  openLink(Config.releaseNotesUrl)
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

const mapStoreToProps = (store: RootStore) => ({
  onDiscordClick: handleDiscord,
  onSupportClick: handleSupport,
  onVersionClick: handleVersion,
  version: Config.appVersion,
})

export const BottomBarContainer = connect(
  mapStoreToProps,
  BottomBar,
)
