import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { Referral } from '../../../referral/models'
import { ReferralDefinition } from '../../../referral/models/ReferralDefinition'
import { CurrentReferralProgress } from './CurrentReferralProgress'
import { ReferralCode } from './ReferralCode'
import { ReferralCodeEntryComponent } from './ReferralCodeEntryComponent'
import { ReferralDescription } from './ReferralDescription'
import { ReferralItem } from './ReferralItem'
import { ReferralList } from './ReferralList'
import { ReferralStats } from './ReferralStats'
import { SendReferral } from './SendReferral'

const def: ReferralDefinition = {
  balanceThreshold: 5,
  bonusRate: 0.5,
  referrerBonus: 1,
}

const referrals: Referral[] = [
  { refereeId: 'u-01', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 1, referralDefinition: def },
  { refereeId: 'u-02', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 2, referralDefinition: def },
  { refereeId: 'u-03', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 3, referralDefinition: def },
  { refereeId: 'u-04', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 4, referralDefinition: def },
  { refereeId: 'u-05', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 5, referralDefinition: def },
  { refereeId: 'u-05', referrerId: 'u-99', code: 'ABCDEF', earnedBalance: 6, referralDefinition: def },
]

storiesOf('Modules|Referral/Components', module)
  .add('Referral Item', () => (
    <div>
      <ReferralItem referral={referrals[0]} />
    </div>
  ))
  .add('Referral Stats', () => {
    return (
      <div>
        <ReferralStats totalEarned={164.2345} potentialEarned={6.345} />
      </div>
    )
  })
  .add('Referral Code', () => {
    return (
      <div>
        <ReferralCode code="ABCDEFG" />
      </div>
    )
  })
  .add('Send Referral', () => {
    return (
      <div>
        <SendReferral sending={boolean('Sending', false)} onSend={action('Send referral')} />
      </div>
    )
  })
  .add('Referral Description', () => {
    return (
      <div>
        <ReferralDescription />
      </div>
    )
  })
  .add('Referral Code Entry', () => {
    return (
      <div>
        <ReferralCodeEntryComponent />
      </div>
    )
  })

storiesOf('Modules|Referral/Referral List', module)
  .addDecorator((storyFn) => {
    return <div>{storyFn()}</div>
  })
  .add('Empty List', () => (
    <div>
      <ReferralList referrals={[]} />
    </div>
  ))
  .add('Referral List', () => {
    return (
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
        <ReferralList referrals={referrals} />
      </div>
    )
  })

storiesOf('Modules|Referral/Current User Referral', module)
  .addDecorator((storyFn) => {
    return <div>{storyFn()}</div>
  })
  .add('CurrentReferralProgress', () => <CurrentReferralProgress referral={referrals[0]} />)
