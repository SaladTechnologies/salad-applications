import React, { Component } from 'react'
import { OfflineModalContainer } from './modules/home-views'
import { getStore } from './Store'
import withStyles, { WithStyles } from 'react-jss'
import { ToastContainer } from 'react-toastify'
import Routes from './Routes'
import { MainTitlebarContainer } from './modules/home-views/MainTitlebarContainer'
import { FooterBarContainer } from './modules/home-views'

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
  },
  content: {
    display: 'flex',
    flex: 1,
    maxWidth: 1600,
    position: 'relative',
  },
}

interface Props extends WithStyles<typeof styles> {}

class _App extends Component<Props> {
  store = getStore()

  componentDidMount = async () => {
    if (this.store.auth.isAuth) {
      await this.store.onLogin()
      //Force the app to reload once all data has been loaded
      this.forceUpdate()
    }

    if (this.store.native.isNative) {
      console.log('Running in native env')
    } else {
      console.log('Running in web env')
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.mainWindow}>
        <OfflineModalContainer />
        <MainTitlebarContainer />
        <div className={classes.container}>
          <div className={classes.content}>
            <Routes />
          </div>
          <ToastContainer />
        </div>
        <FooterBarContainer />
      </div>
    )
  }
}

export const App = withStyles(styles)(_App)

export default App
