import React from 'react'
import { storiesOf } from '@storybook/react'
import { ReferralItem } from './ReferralItem'
import { Referral } from '../../referral/models'
import { ReferralList } from './ReferralList'
import { action } from '@storybook/addon-actions'
import { NewReferralModal } from './NewReferralModal'

storiesOf('Modules/Referral', module)
  .add('Referral Item', () => (
    <div>
      <ReferralItem username={'really-long-name@long-domain.io'} />
      <ReferralItem username={'dev@salad.io'} status="42% to 5000xp" />
      <ReferralItem username={'dev@salad.io'} status="42% to 5000xp" balanceReward={5} />
    </div>
  ))
  .add('Referral List', () => {
    const referrals: Referral[] = [
      { id: '1', username: 'dev1@salad.io', status: 'WAITING FOR LOGIN', balanceReward: 5 },
      { id: '2', username: 'dev2@salad.io', status: 'WAITING FOR LOGIN', balanceReward: 5 },
      { id: '3', username: 'dev3@salad.io', status: 'WAITING FOR LOGIN', balanceReward: 5 },
      { id: '4', username: 'dev4@salad.io', status: 'WAITING FOR LOGIN', balanceReward: 5 },
      { id: '5', username: 'dev5@salad.io', status: 'WAITING FOR LOGIN', balanceReward: 5 },
      { id: '6', username: 'dev6@salad.io', status: 'WAITING FOR LOGIN', balanceReward: 5 },
    ]

    return <ReferralList referrals={referrals} onCreateNew={action('Create new')} />
  })
  .add('New Referral Modal', () => {
    return <NewReferralModal onCloseClicked={action('close')} onSend={action('send')} />
  })
