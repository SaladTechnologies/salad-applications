import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Route, Switch } from 'react-router'
import { MainStorefrontContainer, RewardSearchResultContainer, RewardBrowseCategoryContainer } from '../reward-views'
import { getStore } from '../../Store'
import { ProfileMenuItemContainer } from '../profile-views'
import { StartButtonContainer } from '../machine-views'
import { MainTitlebarContainer } from './MainTitlebarContainer'
import { NotificationBannerContainer } from './NotificationBannerContainer'
import { SaladTheme } from '../../SaladTheme'

const styles = (theme: SaladTheme) => ({
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
    borderBottom: `1px solid ${theme.green}`,
  },
  main: {
    flex: 1,
    position: 'relative',
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
            <Switch>
              <Route exact path="/search" component={RewardSearchResultContainer} />
              <Route exact path="/browse/category/:category" component={RewardBrowseCategoryContainer} />
              <Route path="/" component={MainStorefrontContainer} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export const HomePage = withStyles(styles)(_HomePage)
