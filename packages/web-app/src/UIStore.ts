import { action } from 'mobx'
import { RootStore } from './Store'

export class UIStore {
  constructor(private readonly store: RootStore) {}

  @action
  showModal = (url: string) => {
    this.store.routing.push(url)
  }

  @action
  hideModal = () => {
    this.store.routing.replace('/')
  }

  showProfilePage = () => {
    this.showModal('/profile')
    this.store.analytics.track('Viewed Profile')
  }

  showSettingsPage = () => {
    this.showModal('/settings/windows-settings')
    this.store.analytics.track('Viewed Settings')
  }

  @action
  openCanny=()=>{
    const openLink = (url: string) => {
      window.open(url, '_blank')
    }
    if( this.store.profile.currentProfile !== undefined){
      //@ts-ignore
      Canny('identify', {
        appID: '5d1b944c723f2266bea8f5b7',
        user: {
          // Replace these values with the current user's data
          email: this.store.profile.currentProfile.email,
          name: this.store.profile.currentProfile.username,
          id: this.store.profile.currentProfile.id, 
    
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

  showReferralsPage = () => {
    this.showModal('/settings/referrals')
    this.store.analytics.track('Referrals')
  }
}
