import { BottomBar } from './components/BottomBar'
import { connect } from '../../connect'
import { Config } from '../../config'
import { RootStore } from '../../Store';


const handleDiscord = () => {
  openLink(Config.discordUrl)
}

const handleSupport = (store: RootStore) => {

  if( store.profile.currentProfile !== undefined){
  //@ts-ignore
  Canny('identify', {
    appID: '5d1b944c723f2266bea8f5b7',
    user: {
      // Replace these values with the current user's data
      email: store.profile.currentProfile.email,
      name: store.profile.currentProfile.username,
      id: store.profile.currentProfile.id, 

      // // These fields are optional, but recommended:
      avatarURL: 'https://s3.us-east-2.amazonaws.com/salad-ui-assets/cool-carrot.png'
      // created: new Date(user.created).toISOString(),
    }
  }, 
  ()=>{
    console.log('canny recieved');
    openLink('https://feedback.salad.io')
  }
  )
} else{
  openLink('https://feedback.salad.io')

}

  
}

const handleVersion = () => {
  openLink(Config.releaseNotesUrl)
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

const mapStoreToProps = (store: RootStore) => ({
  onDiscordClick: handleDiscord,
  onSupportClick: () => handleSupport(store),
  onVersionClick: handleVersion,
  version: Config.appVersion,
})

export const BottomBarContainer = connect(
  mapStoreToProps,
  BottomBar,
)
