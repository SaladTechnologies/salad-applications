import { BottomBar } from './components/BottomBar'
import { connect, MapStoreToProps } from '../../connect'

const handleDiscord = () => {
  openLink('https://discord.gg/xcvmgQk')
}

const handleSupport = () => {
  openLink('https://salad.zendesk.com')
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

const mapStoreToProps: MapStoreToProps = store => ({
  onDiscordClick: handleDiscord,
  onSupportClick: handleSupport,
})

export const BottomBarContainer = connect(
  mapStoreToProps,
  BottomBar,
)
