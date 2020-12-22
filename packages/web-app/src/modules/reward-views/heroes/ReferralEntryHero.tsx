import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { HeroTitle, P, SectionHeader, SmartLink } from '../../../components'
import { HeroPanel } from '../../../components/HeroPanel'
import { SaladTheme } from '../../../SaladTheme'
import { ReferralCodeEntryContainer } from '../../account-views'

const styles = (theme: SaladTheme) => ({
  column: {
    flex: 1,
  },
  contentColumn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    backgroundColor: theme.darkBlue,
    color: theme.lightGreen,
    padding: 20,
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
  },
})

interface Props extends WithStyles<typeof styles> {}

class _ReferralEntryHero extends Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <HeroPanel color="green">
        <div className={classes.column}>
          <HeroTitle>Received a Referral Code?</HeroTitle>
          If you received a promo code from an influencer or a referral code from a friend enter it now. Head over to
          the <SmartLink to="/earn/referrals">Referral page</SmartLink> for more information.
          <br />
          <br />
          <SmartLink to="/earn/referrals">Learn More</SmartLink>
        </div>
        <div className={classnames(classes.column, classes.contentColumn)}>
          <div className={classes.wrapper}>
            <SectionHeader>Enter A Code</SectionHeader>
            <P>Received a referral code? Enter it below so you can earn your referral bonus!</P>
            <ReferralCodeEntryContainer />
          </div>
        </div>
      </HeroPanel>
    )
  }
}

export const ReferralEntryHero = withStyles(styles)(_ReferralEntryHero)
