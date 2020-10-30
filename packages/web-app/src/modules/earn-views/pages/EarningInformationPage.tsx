import React, { Component } from 'react'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Li, P, Scrollbar, SectionHeader, SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import earningOverview from '../assets/earning-overview.svg'
import mining from '../assets/mining.svg'
import offerwall from '../assets/offerwall.svg'
import referral from '../assets/referral.svg'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: theme.lightGreen,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexBasis: '50%',
    justifyContent: 'center',
  },
  startContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _EarningInformationPage extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <Scrollbar>
          <div className={classes.content}>
            <div className={classes.splitContainer}>
              <div className={classes.column} style={{ paddingRight: 20 }}>
                <SectionHeader>What is Earning?</SectionHeader>
                <P>
                  You can earn with Salad in several ways, from mining crypto, completing offers, and fulfilling
                  referrals. All of these earnings are converted automatically for you into Salad Balance. This Balance
                  can be used to redeem rewards in our Storefront.
                </P>
              </div>
              <div className={classes.column}></div>
            </div>
            <Img style={{ width: '100%' }} src={earningOverview} />
            <Divider />

            <SectionHeader>Mining</SectionHeader>
            <div className={classes.splitContainer}>
              <div className={classes.column}>
                <P>
                  Mining powers the world of cryptocurrency, and it's the bread and butter of Salad Earnings. We make
                  the process easy; Salad automatically matches your PC to the most profitable mining protocols and
                  converts crypto into Salad Balance, usable immediately in our Storefront. Just press "Start," wait for
                  us to configure your computer, and start Earning.
                </P>
                <P>
                  <SmartLink to="/earn/mine">Learn More</SmartLink>
                </P>
              </div>
              <div className={classes.column}>
                <Img src={mining} />
              </div>
            </div>
            <Divider />

            <div className={classes.splitContainer}>
              <div className={classes.column}>
                <Img src={offerwall} />
              </div>
              <div className={classes.column}>
                <SectionHeader>Offerwalls</SectionHeader>
                <P>Earn Salad Balance by completing offers such as:</P>
                <Li>Downloading and playing mobile games</Li>
                <Li>Filling out surveys</Li>
                <Li>Watching advertisements</Li>
                <P>
                  Offers payout anywhere from $0.01 - $20.00+, depending on the task. Whether you want to top off your
                  balance, boost your typical earnings, or can't mine with Salad, Offerwalls allow you to make more
                  money.
                </P>
                <P>
                  <SmartLink to="/earn/offerwall">Learn More</SmartLink>
                </P>
              </div>
            </div>
            <Divider />

            <SectionHeader>Referrals</SectionHeader>
            <div className={classes.splitContainer}>
              <div className={classes.column}>
                <P>
                  Referrals allow you to easily invite friends, family, and acquaintances to join you in Salad. You
                  receive a 50% earnings bonus relative to your referee's Salad earnings (up to $1 per referral), which
                  is paid out incrementally as they mine. The more your referee runs Salad, the faster you'll earn your
                  bonus.
                </P>
                <P>
                  <SmartLink to="/earn/referrals">Learn More</SmartLink>
                </P>
              </div>
              <div className={classes.column}>
                <Img src={referral} />
              </div>
            </div>
            <Divider />
          </div>
        </Scrollbar>
      </div>
    )
  }
}

export const EarningInformationPage = withStyles(styles)(_EarningInformationPage)
