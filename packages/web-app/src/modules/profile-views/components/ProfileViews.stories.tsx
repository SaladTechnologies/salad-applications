import React from 'react'
import { storiesOf } from '@storybook/react'
import { AccountModalPage } from './AccountModalPage'
import { action } from '@storybook/addon-actions'
import { Profile } from '../../profile/models'
import { ProfileMenuItem } from './ProfileMenuItem'

const profile: Profile = {
  id: '1234',
  username: 'Master Chef Bob is World #1 hero',
  email: 'dev@salad.io',
}

storiesOf('Modules/Profile', module)
  .add('Account Modal', () => {
    return (
      <div>
        <AccountModalPage profile={profile} onCloseClicked={action('close')} onLogout={action('logout')} />
      </div>
    )
  })
  .add('Profile Menu Item', () => {
    return <ProfileMenuItem profile={profile} xp={1234} />
  })
