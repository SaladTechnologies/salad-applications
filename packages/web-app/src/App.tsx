import { SearchProvider } from '@elastic/react-search-ui'
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector'
import { History } from 'history'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { ToastContainer } from 'react-toastify'
import { LoadingPage, MobileDevice, NotMobile } from './components'
import { FooterBarContainer } from './modules/home-views'
import { MainTitlebarContainer } from './modules/home-views/MainTitlebarContainer'
import { Routes } from './Routes'
import { getStore } from './Store'

const styles = {
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
}

interface Props extends WithStyles<typeof styles> {
  history: History
}

//TODO: Get all these values from our config
const searchConfig = {
  apiConnector: new AppSearchAPIConnector({
    endpointBase: 'http://localhost:3002',
    engineName: 'salad-rewards',
    searchKey: 'search-7ezfca6rid8xgyggzs7nxnhq',
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
          this.store.auth.loginSilently()
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
      const isNative = this.store.native.isNative

      return (
        <>
          <MobileDevice>
            <LoadingPage text={`Device Not Currently Supported`} />
          </MobileDevice>
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
              {isNative && <FooterBarContainer />}
            </div>
          </NotMobile>
        </>
      )
    }
  },
)
