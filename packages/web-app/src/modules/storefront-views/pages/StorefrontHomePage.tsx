import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Redirect, Route, Switch } from 'react-router'
import { MustUpdateNotificationBanner } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { RewardSearchBarContainer, RewardSearchResultContainer } from '../../reward-views'
import { StorefrontPageContainer } from '../StorefrontPageContainer'

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

class _StorefrontHomePage extends Component<WithStyles<typeof styles>> {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.appContainer}>
          <RewardSearchBarContainer />
          <MustUpdateNotificationBanner />
          <div className={classes.main}>
            <Switch>
              <Route exact path="/" component={StorefrontPageContainer} />
              <Route exact path="/search" component={RewardSearchResultContainer} />
              <Redirect to="/" />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export const StorefrontHomePage = withStyles(styles)(_StorefrontHomePage)
