import React from 'react'
import { storiesOf } from '@storybook/react'
import { ReferralItem } from './ReferralItem'
import { Referral } from '../../referral/models'
import { ReferralList } from './ReferralList'
import { action } from '@storybook/addon-actions'
import { ReferralSummary } from './ReferralSummary'
import { ReferralDefinition } from '../../referral/models/ReferralDefinition'
import { ReferralStats } from './ReferralStats'

const def: ReferralDefinition = new ReferralDefinition({
  balanceThreshold: 5,
  bonusRate: 0.5,
  referrerBonus: 1,
})

const referrals: Referral[] = [
  new Referral({ refereeId: 'u-01', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 1, referralDefinition: def }),
  new Referral({ refereeId: 'u-02', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 2, referralDefinition: def }),
  new Referral({ refereeId: 'u-03', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 3, referralDefinition: def }),
  new Referral({ refereeId: 'u-04', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 4, referralDefinition: def }),
  new Referral({ refereeId: 'u-05', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 5, referralDefinition: def }),
  new Referral({ refereeId: 'u-05', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 6, referralDefinition: def }),
]

storiesOf('Modules/Referral', module)
  .add('Referral Item', () => (
    <div>
      <ReferralItem referral={referrals[0]} />
    </div>
  ))
  .add('Referral Summary', () => {
    return (
      <ReferralSummary
        referralCode={'SALAD'}
        pendingCount={4}
        completedCount={20}
        onOpenDetails={action('open details')}
      />
    )
  })
  .add('Referral Stats', () => {
    return (
      <div style={{ backgroundColor: '#B2D530' }}>
        <ReferralStats completeCount={48} inProgressCount={4} totalEarned={164.2345} potentialEarned={6.345} />
      </div>
    )
  })

storiesOf('Modules|Referral/Referral List', module)
  .addDecorator(storyFn => {
    return <div style={{ backgroundColor: '#B2D530' }}>{storyFn()}</div>
  })
  .add('Empty List', () => <ReferralList referrals={[]} />)
  .add('Referral List', () => {
    return <ReferralList referrals={referrals} />
  })
