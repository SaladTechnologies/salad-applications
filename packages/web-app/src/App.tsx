import { SearchProvider } from '@elastic/react-search-ui'
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector'
import type { History } from 'history'
import type { ReactNode } from 'react'
import { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ToastContainer } from 'react-toastify'
import { MobileRoutes } from './MobileRoutes'
import { Routes } from './Routes'
import type { SaladTheme } from './SaladTheme'
import { getStore } from './Store'
import { MobileDevice, NotMobile } from './components'
import { config } from './config'
import { NavigationBarContainer } from './modules/home-views'
import { NovuNotificationBanner } from './modules/notifications-views/components'

const styles = (theme: SaladTheme) => ({
  mainWindow: {
    userSelect: 'none',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  mobileMainWindow: {
    userSelect: 'none',
    color: theme.lightGreen,
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  mobileContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    marginTop: 60,
  },
  navigationContainer: {
    position: 'relative',
    '& > div': {
      borderBottom: `solid 1px ${theme.lightGreen}`,
    },
  },
  mobileNavigationContainer: {
    position: 'relative',
    '& > div > div': {
      borderBottom: `solid 1px ${theme.lightGreen}`,
    },
  },
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    flex: 1,
    maxWidth: 1600,
    position: 'relative',
    marginTop: 60,
  },
})

interface Props extends WithStyles<typeof styles> {
  history: History
}

const searchConfig = {
  apiConnector: new AppSearchAPIConnector({
    endpointBase: config.searchUrl,
    engineName: config.searchEngine,
    searchKey: config.searchKey,
  }),
  searchQuery: {
    resultsPerPage: 100,
    facets: {
      tags: {
        type: 'value',
        size: 100,
      },
      platform: {
        type: 'value',
        size: 100,
      },
      price: {
        type: 'range',
        ranges: [
          { from: 0, to: 0.5, name: 'Under $0.50' },
          { from: 0.5, to: 1, name: '$0.50 to $1' },
          { from: 1, to: 5, name: '$1 to $5' },
          { from: 5, to: 10, name: '$5 to $10' },
          { from: 10, name: '$10 & Above' },
        ],
      },
    },
  },
  pathname: '/store/search',
}

export const App = withStyles(styles)(
  class App extends Component<Props> {
    store = getStore()

    public override render(): ReactNode {
      const { classes, history } = this.props
      const shouldShowNovuBanner = this.store.auth.isAuthenticated && this.store.profile.novuSignature

      return (
        <>
          {shouldShowNovuBanner && <NovuNotificationBanner />}
          <MobileDevice>
            <div className={classes.mobileMainWindow}>
              <div className={classes.mobileNavigationContainer}>
                <NavigationBarContainer />
              </div>
              <Scrollbars>
                <div className={classes.mobileContent}>
                  <MobileRoutes />
                </div>
              </Scrollbars>
            </div>
          </MobileDevice>
          <NotMobile>
            <div className={classes.mainWindow}>
              <div className={classes.navigationContainer}>
                <NavigationBarContainer />
              </div>
              <div className={classes.container}>
                <div className={classes.content}>
                  <SearchProvider
                    config={{
                      ...searchConfig,
                      history: history,
                    }}
                  >
                    <Routes />
                  </SearchProvider>
                </div>
                <ToastContainer />
              </div>
            </div>
          </NotMobile>
        </>
      )
    }
  },
)
