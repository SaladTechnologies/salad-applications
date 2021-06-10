import { SearchProvider } from '@elastic/react-search-ui'
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector'
import { ThemeProvider } from '@emotion/react'
import { History } from 'history'
import { Component } from 'react'
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

// put it somewhere else
const fontFamilyPrimary =
  'Mallory, BlinkMacSystemFont, -apple-system, Work Sans, Segoe UI, Fira Sans, Helvetica Neue, Helvetica, Arial, sans-serif'
const fontFamilyMedium =
  'Mallory Medium, BlinkMacSystemFont, -apple-system, Work Sans, Segoe UI, Fira Sans, Helvetica Neue, Helvetica, Arial, sans-serif'

export const DefaultTheme = {
  colors: {
    black: '#000000',
    darkBlue: '#0A2133',
    darkGreen: '#1F4F22',
    gray: '#738188',
    green: '#B2D530',
    lightGreen: '#DBF1C1',
    mediumGreen: '#53A626',
    orange: '#FF9933',
    cyan: '#33CCCC',
    magenta: '#FF3399',
    purple: '#6600CC',
    red: '#EF502A',
    yellow: '#FFFF33',
    white: '#FFFFFF',
  },
  gradient: {
    primary: 'linear-gradient(to right, #56A431 , #AACF40)',
  },
  typography: {
    fontFamily: {
      primary: fontFamilyPrimary,
      medium: fontFamilyMedium,
    },
    variants: {
      base4XL: {
        fontFamily: fontFamilyPrimary,
        fontSize: '64px',
        lineHeight: '64px',
      },
      base3XL: {
        fontFamily: fontFamilyPrimary,
        fontSize: '48px',
        lineHeight: '54px',
      },
      baseXXL: {
        fontFamily: fontFamilyPrimary,
        fontSize: '32px',
        lineHeight: '34px',
      },
      baseXL: {
        fontFamily: fontFamilyPrimary,
        fontSize: '24px',
        lineHeight: '26px',
      },
      baseL: {
        fontFamily: fontFamilyPrimary,
        fontSize: '18px',
        lineHeight: '22px',
      },
      baseM: {
        fontFamily: fontFamilyPrimary,
        fontSize: '16px',
        lineHeight: '20px',
      },
      baseS: {
        fontFamily: fontFamilyPrimary,
        fontSize: '14px',
        lineHeight: '18px',
      },
      baseXS: {
        fontFamily: fontFamilyPrimary,
        fontSize: '12px',
        lineHeight: '16px',
      },
    },
  },
  boxShadow: {
    primary: '0px 0px 24px rgba(178, 213, 48, 0.7)',
  },
  breakPoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1280,
  },
}

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
    <MainTitlebarContainer />
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
        <ThemeProvider theme={DefaultTheme}>
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
              <NotMobile>
                <DesktopLayout {...this.props} />
              </NotMobile>
            </>
          )}
          {isDesktop && <DesktopLayout {...this.props} />}
        </ThemeProvider>
      )
    }
  },
)
