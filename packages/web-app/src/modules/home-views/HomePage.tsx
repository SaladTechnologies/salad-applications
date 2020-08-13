import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Route, Switch } from 'react-router'
import { SaladTheme } from '../../SaladTheme'
import { MainStorefrontContainer, RewardSearchBarContainer, RewardSearchResultContainer } from '../reward-views'

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
  render() {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.appContainer}>
          <RewardSearchBarContainer />
          <div className={classes.main}>
            <Switch>
              <Route exact path="/" component={MainStorefrontContainer} />
              <Route exact path="/search" component={RewardSearchResultContainer} />
              {/* <Route exact path="/browse/category/:category" component={RewardBrowseCategoryContainer} /> */}
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export const HomePage = withStyles(styles)(_HomePage)
