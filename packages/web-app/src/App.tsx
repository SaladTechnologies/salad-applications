import { SearchProvider } from '@elastic/react-search-ui'
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector'
import classNames from 'classnames'
import type { History } from 'history'
import { useEffect } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { UseErrorBoundaryApi } from 'react-error-boundary'
import { useErrorBoundary } from 'react-error-boundary'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ToastContainer } from 'react-toastify'
import { FeatureFlags, useFeatureManager } from './FeatureManager'
import { MobileRoutes } from './MobileRoutes'
import { Routes } from './Routes'
import type { SaladTheme } from './SaladTheme'
import type { RootStore } from './Store'
import { MobileDevice, NotMobile } from './components'
import { config } from './config'
import { connect } from './connect'
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
  withBanner: {
    marginTop: 115,
  },
})

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

interface AppProps extends WithStyles<typeof styles> {
  isAuthenticated: boolean
  setErrorBoundary: (errorBoundary: UseErrorBoundaryApi<Error>) => void
  withInstallReminder: boolean
  novuSignature: string
  history: History
}

export const _App = ({
  classes,
  history,
  isAuthenticated,
  setErrorBoundary,
  novuSignature,
  withInstallReminder,
}: AppProps) => {
  const featureManager = useFeatureManager()
  const errorBoundary = useErrorBoundary()

  const shouldShowNovuBanner = isAuthenticated && novuSignature
  const isNewChefDownloadFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.NewChefDownload)

  useEffect(() => {
    setErrorBoundary(errorBoundary)
  }, [setErrorBoundary, errorBoundary])

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
          <NavigationBarContainer />
          <div className={classes.container}>
            <div
              className={classNames(
                classes.content,
                isNewChefDownloadFeatureFlagEnabled && withInstallReminder && classes.withBanner,
              )}
            >
              <SearchProvider
                config={{
                  ...searchConfig,
                  history: history,
                }}
              >
                <Routes isAuthenticated={isAuthenticated} />
              </SearchProvider>
            </div>
            <ToastContainer />
          </div>
        </div>
      </NotMobile>
    </>
  )
}

const mapStoreToProps = (store: RootStore, props: AppProps): any => ({
  ...props,
  isAuthenticated: store.auth.isAuthenticated,
  novuSignature: store.profile.novuSignature,
  setErrorBoundary: store.errorBoundary.setErrorBoundary,
  withInstallReminder: store.profile.withInstallReminder,
})

export const App = connect(mapStoreToProps, withStyles(styles)(_App))
