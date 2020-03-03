import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { ExperienceBarContainer, SlicedVeggieContainer } from '../xp-views'
import { RewardListContainer, RewardFilterContainer, SelectedRewardContainer } from '../reward-views'
import { getStore } from '../../Store'
import { BottomBarContainer } from './BottomBarContainer'
import { ProfileMenuItemContainer, UserStatsSummaryContainer } from '../profile-views'
import { StartButtonContainer } from '../machine-views'
import { Fade } from '../../components'
import { ReferralSummaryContainer } from '../settings-views/referral-views'
import { MainTitlebarContainer } from './MainTitlebarContainer'
import { NotificationBannerContainer } from './NotificationBannerContainer'

const styles = ({
  container: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    overflow: 'hidden',
    position: 'absolute',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
  },
  appContainer: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    zIndex: 2000,
  },
  headerFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100px',
    zIndex: 1000,
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    flex: 1,
  },
  mainColumn: {},
  verticalLayout: {
    display: 'flex',
    flexDirection: 'column',
  },
  veggieColumn: {
    marginRight: 'auto',
  },
  rightColumn: {
    padding: '1rem 1rem 3rem',
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  footer: {
    flex: 'none',
  },
})

class _HomePage extends Component<WithStyles<typeof styles>> {
  store = getStore()

  componentWillUnmount() {
    this.store.refresh.stop()
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <MainTitlebarContainer />
        <div className={classes.appContainer}>
          <Fade className={classnames(classes.headerFade)} direction="down" />
          <div className={classes.header}>
            <ProfileMenuItemContainer />
            <div style={{ marginLeft: 'auto', marginTop: '-1px' }}>
              <NotificationBannerContainer />
            </div>
            <div style={{ marginLeft: 'auto', marginTop: '-1px' }}>
              <StartButtonContainer />
            </div>
          </div>

          <div className={classes.main}>
            {/* XP bar */}
            <div className={classnames(classes.mainColumn, classes.verticalLayout)}>
              <ExperienceBarContainer />
            </div>

            {/* Veggie column */}
            <div className={classnames(classes.mainColumn, classes.veggieColumn)}>
              <SlicedVeggieContainer />
            </div>

            {/* Rewards column */}
            <div className={classnames(classes.mainColumn, classes.verticalLayout)}>
              <SelectedRewardContainer />
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'stretch',
                  flexDirection: 'row',
                }}
              >
                <RewardFilterContainer />
                <RewardListContainer />
              </div>
            </div>

            {/* Right column */}
            <div className={classnames(classes.mainColumn, classes.rightColumn, classes.verticalLayout)}>
              <UserStatsSummaryContainer />
              <div style={{ zIndex: 2000, marginTop: 'auto' }}>
                <ReferralSummaryContainer />
              </div>
            </div>
          </div>

          <div className={classes.footer}>
            <BottomBarContainer />
          </div>
        </div>
      </div>
    )
  }
}

export const HomePage = withStyles(styles)(_HomePage)
