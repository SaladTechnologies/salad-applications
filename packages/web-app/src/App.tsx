import { SearchProvider } from '@elastic/react-search-ui'
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector'
import { ThemeProvider } from '@emotion/react'
import { DefaultTheme } from '@saladtechnologies/garden-components'
import { History } from 'history'
import { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'
import withStyles, { WithStyles } from 'react-jss'
import { ToastContainer } from 'react-toastify'
import { MobileDevice, NotMobile } from './components'
import { config } from './config'
import { MobileRoutes } from './MobileRoutes'
import { NavigationBarContainer } from './modules/home-views'
import { Routes } from './Routes'
import { SaladTheme } from './SaladTheme'
import { getStore } from './Store'

const cache = createIntlCache()
const intl = createIntl(
  {
    locale: 'en-US',
    messages: {},
  },
  cache,
)

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
    paddingBottom: 100,
  },
  navBarLine: {
    borderTop: `1px solid ${theme.green}`,
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
  pathname: '/search',
}

const DesktopLayout = ({ history, classes }: Props) => (
  <div className={classes.mainWindow}>
    <div>
      <NavigationBarContainer />
      <hr className={classes.navBarLine} />
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
)

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
        <RawIntlProvider value={intl}>
          <ThemeProvider theme={DefaultTheme}>
            {!isDesktop && (
              <>
                <MobileDevice>
                  <div className={classes.mobileMainWindow}>
                    <div>
                      <NavigationBarContainer />
                      <hr className={classes.navBarLine} />
                    </div>
                    <Scrollbars>
                      <div className={classes.mobileContent}>
                        <MobileRoutes />
                      </div>
                    </Scrollbars>
                  </div>
                </MobileDevice>
                <NotMobile>
                  <DesktopLayout {...this.props} />
                </NotMobile>
              </>
            )}
            {isDesktop && <DesktopLayout {...this.props} />}
          </ThemeProvider>
        </RawIntlProvider>
      )
    }
  },
)
