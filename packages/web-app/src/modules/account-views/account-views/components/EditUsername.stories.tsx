import { storiesOf } from '@storybook/react'
import { EditUsername } from './EditUsername'

storiesOf('Modules/Account/AccountViews/components/EditUsername', module).add('default', () => {
  const profile = {
    email: 'LUKE_SKYWALKER@SALAD.COM',
    id: '1e1e1e1e-e3e3-f333-c123-000000000000',
    lastSeenApplicationVersion: '2020-12-10',
    username: 'LUKE',
    viewedReferralOnboarding: false,
  }
  return (
    <div style={{ backgroundColor: '#0A2133' }}>
      <EditUsername profile={profile} />
    </div>
  )
})
