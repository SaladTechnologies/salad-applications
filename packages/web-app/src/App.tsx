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

interface Props extends WithStyles<typeof styles> {}

export const App = withStyles(styles)(
  class App extends Component<Props> {
    store = getStore()

    componentDidMount = async () => {
      this.store.auth.loginSilently()
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
                  <Routes />
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
