import { useState } from 'react'
import { useCurrentReferral, useReferralCode, useReferralsReport } from '../../../account/referrals.ts'
import { useHttp } from '../../../data/http-context.ts'
import { useStore } from '../../../Store'
import { ReferralSettings } from './components/ReferralSettings'

/**
 * The referrals page. It reads the referral data that sign-in and the app-wide refresh load, and sends a referral email
 * the way the referral store did: sending while the request runs, then tracking it when it succeeds.
 */
export const ReferralSettingsContainer = () => {
  const { analytics } = useStore()
  const http = useHttp()
  const referral = useCurrentReferral()
  const { code } = useReferralCode()
  const report = useReferralsReport()
  const [sending, setSending] = useState(false)

  const onSend = async (email: string) => {
    console.log('Sending Referral')
    setSending(true)
    try {
      await http.post('/api/v1/profile/referrals', { email })
      analytics.trackReferralSent()
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      setSending(false)
    }
  }

  return (
    <ReferralSettings
      referral={referral}
      code={code}
      sending={sending}
      onSend={onSend}
      totalEarned={report?.totalEarned}
      potentialEarned={report?.potentialEarnings}
      latestReferrals={report?.latestReferrals}
    />
  )
}
