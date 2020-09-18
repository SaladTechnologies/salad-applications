import { SearchProvider } from '@elastic/react-search-ui'
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector'
import { History } from 'history'
import React, { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import withStyles, { WithStyles } from 'react-jss'
import { ToastContainer } from 'react-toastify'
import { MobileDevice, NotMobile } from './components'
import { config } from './config'
import { MobileRoutes } from './MobileRoutes'
import { MobileNavbarContainer, MobileTitlebarContainer } from './modules/home-views-mobile'
import { MainTitlebarContainer } from './modules/home-views/MainTitlebarContainer'
import { Routes } from './Routes'
import { SaladTheme } from './SaladTheme'
import { getStore } from './Store'

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
    padding: 20,
    flex: 1,
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
    resultsPerPage: 200,
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
  pathname: '/search',
}

export const App = withStyles(styles)(
  class App extends Component<Props> {
    store = getStore()

    componentDidMount = async () => {
      if (!this.store.auth.isAuthenticationPending) {
        try {
          this.store.auth.loginSilently().catch(() => {
            console.log('Failed to login silently')
          })
        } catch (error) {
          console.log('Failed to login silently')
        }
      }

      if (this.store.native.isNative) {
        console.log('Running in native env')
      } else {
        console.log('Running in web env')
      }
    }

    render() {
      const { classes } = this.props

      const isDesktop = this.store.native.isNative

      return (
        <>
          {!isDesktop && (
            <>
              <MobileDevice>
                <div className={classes.mobileMainWindow}>
                  <MobileTitlebarContainer />
                  <Scrollbars>
                    <div className={classes.mobileContent}>
                      <MobileRoutes />
                    </div>
                  </Scrollbars>
                  <MobileNavbarContainer />
                </div>
              </MobileDevice>
            </>
          )}
          <NotMobile>
            <div className={classes.mainWindow}>
              <MainTitlebarContainer />
              <div className={classes.container}>
                <div className={classes.content}>
                  <SearchProvider
                    config={{
                      ...searchConfig,
                      history: this.props.history,
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
