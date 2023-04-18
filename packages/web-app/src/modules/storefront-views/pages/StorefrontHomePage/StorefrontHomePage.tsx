import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Route, Switch } from 'react-router'
import type { SaladTheme } from '../../../../SaladTheme'
import { StorefrontPageContainer } from '../../StorefrontPageContainer'
import { RewardSearchBarContainer } from './RewardSearchBar/RewardSearchBarContainer'
import { RewardSearchResultContainer } from './RewardSearchResult/RewardSearchResultContainer'

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
  public override render(): ReactNode {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.appContainer}>
          <RewardSearchBarContainer />
          <div className={classes.main}>
            <Switch>
              <Route exact path="/store" component={StorefrontPageContainer} />
              <Route exact path="/store/search" component={RewardSearchResultContainer} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export const StorefrontHomePage = withStyles(styles)(_StorefrontHomePage)
