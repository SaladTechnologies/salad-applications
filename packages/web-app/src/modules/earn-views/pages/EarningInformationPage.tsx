import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Scrollbar, SectionHeader, P, SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { StartButtonContainer } from '../../machine-views'

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
                  With Salad you can easily earn Salad balance to purchase anything available in our Store or on partner
                  websites that support SaladPay.
                </P>
              </div>
              <div className={classes.column}></div>
            </div>
            <Divider />
            <SectionHeader>Offerwalls</SectionHeader>
            <div className={classes.splitContainer}>
              <div className={classes.column}>
                <P>
                  Earn Salad Balance by completing tasks such as downloading and playing mobile games. Whether you just
                  want to top off your balance, boost your regular earnings, or can’t mine with Salad, offerwalls allow
                  you to make more money.
                </P>
                <P>
                  <SmartLink to="/earn/offerwall">Learn More</SmartLink>
                </P>
              </div>
              <div className={classes.column}>{/* TODO: Add some sort of content */}</div>
            </div>
            <Divider />

            <SectionHeader>Mining</SectionHeader>
            <div className={classes.splitContainer}>
              <div className={classes.column}>
                <P>
                  Mining powers the world of cryptocurrency, individual miners (computers) form vast networks of shared
                  processing power to keep networks like Ethereum and Bitcoin running. Mining is easy, simply press the
                  "Start" button and Salad will automatically start mining for you.
                </P>
                <P>
                  <SmartLink to="/earn/mine">Learn More</SmartLink>
                </P>
              </div>
              <div className={classes.column}>
                <div className={classes.startContainer}>
                  <StartButtonContainer />
                </div>
              </div>
            </div>
            <Divider />
            <SectionHeader>Referrals</SectionHeader>
            <div className={classes.splitContainer}>
              <div className={classes.column}>
                <P>
                  Referrals make it easy to invite your friends to join you in Salad. You will receive a 50% bonus
                  relative to your referee's Salad earnings (up to $1 per referee), paid out as they earn. This does not
                  impact their earnings. The more your referees run Salad, the faster you'll see your bonuses.
                </P>
                <P>
                  <SmartLink to="/earn/referrals">Learn More</SmartLink>
                </P>
              </div>
              <div className={classes.column}>{/* TODO: Add some sort of content */}</div>
            </div>
          </div>
        </Scrollbar>
      </div>
    )
  }
}

export const EarningInformationPage = withStyles(styles)(_EarningInformationPage)
