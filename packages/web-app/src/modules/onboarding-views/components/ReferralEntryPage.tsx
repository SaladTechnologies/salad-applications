import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import image from '../assets/Referrals.svg'
import { OnboardingPage } from '../../../components'
import { ReferralCodeEntryComponent } from '../../settings-views/referral-views/components/ReferralCodeEntryComponent'

const styles = ({
  container: {},
})

interface Props extends WithStyles<typeof styles> {
  onNext?: () => void
  onSubmitCode?: (code: string) => Promise<void>
}

class _ReferralEntryPage extends Component<Props> {
  render() {
    const { onSubmitCode, onNext } = this.props
    return (
      <OnboardingPage
        title={'Referral Entry'}
        subtitle={'Referred by a friend? Enter your code below so you can both earn your referral bonus!'}
        image={image}
        nextText={'Skip'}
        onNext={onNext}
        fullHeightImg
      >
        <ReferralCodeEntryComponent onSubmitCode={onSubmitCode} />
      </OnboardingPage>
    )
  }
}

export const ReferralEntryPage = withStyles(styles)(_ReferralEntryPage)
