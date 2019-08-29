import { BottomBar } from './components/BottomBar'
import { connect } from '../../connect'
import { Config } from '../../config'

const handleDiscord = () => {
  openLink(Config.discordUrl)
}

const handleSupport = () => {
  openLink(Config.supportUrl)
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

const mapStoreToProps = () => ({
  onDiscordClick: handleDiscord,
  onSupportClick: handleSupport,
})

export const BottomBarContainer = connect(
  mapStoreToProps,
  BottomBar,
)
