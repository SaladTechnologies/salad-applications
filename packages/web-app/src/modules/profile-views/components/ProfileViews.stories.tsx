import React from 'react'
import { storiesOf } from '@storybook/react'
import { Profile } from '../../profile/models'
import { ProfileMenuItem } from './ProfileMenuItem'

const profile: Profile = {
  id: '1234',
  username: 'Master Chef Bob is World #1 hero',
  email: 'dev@salad.io',
  lastSeenApplicationVersion: '1.0',
}

storiesOf('Modules/Profile', module).add('Profile Menu Item', () => {
  return <ProfileMenuItem profile={profile} xp={1234} />
})
