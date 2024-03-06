import type { FC } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { P, SectionHeader } from '../../../../components'
import type { Referral } from '../../../referral/models'
import { ReferralItem } from './ReferralItem'

const styles = {
  container: {
    padding: 20,
    height: '100%',
  },
  content: {
    paddingBottom: 50,
  },
}

interface Props extends WithStyles<typeof styles> {
  latestReferrals?: Referral[]
}

const _ReferralList: FC<Props> = ({ classes, latestReferrals }) => {
  let hasReferrals = latestReferrals && latestReferrals.length !== 0
  return (
    <div className={classes.container}>
      <SectionHeader>Who you referred</SectionHeader>
      {!hasReferrals && <P>No one has entered your code yet. Send it to your friends now!</P>}
      {hasReferrals && (
        <Scrollbars>
          <div className={classes.content}>
            {latestReferrals &&
              latestReferrals.map(
                (latestReferral) => latestReferral.referralDefinition && <ReferralItem referral={latestReferral} />,
              )}
          </div>
        </Scrollbars>
      )}
    </div>
  )
}

export const ReferralList = withStyles(styles)(_ReferralList)
