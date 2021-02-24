import classNames from 'classnames'
import { Component, createRef, RefObject } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { NotMobile, Overlay, P, Portal } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import logo from '../assets/animated-logo-lg.gif'

const styles = (theme: SaladTheme) => ({
  absoluteCenter: {
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  container: {
    backgroundColor: theme.darkBlue,
    border: 'none',
    boxShadow: 'none',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 9999999999,
  },
  iframeContainer: {
    height: 450,
    width: 300,
  },
  spinner: {
    width: '2vw',
    zIndex: 99999999999,
  },
  subtitle: {
    color: theme.lightGreen,
    fontSize: theme.medium,
    lineHeight: '20.4px',
    marginTop: 50,
    textAlign: 'center',
  },
  title: {
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskLight25,
    marginBottom: 75,
    textAlign: 'center',
  },
})

interface FramePageProps extends WithStyles<typeof styles> {
  createFrameListener: (frame: HTMLIFrameElement, timeout?: number) => () => void
  frameSandbox?: string
  frameTitle: string
  frameUrl: string
  onCloseRequested: () => void
  showWelcomeText?: boolean
}

interface FramePageState {
  frameLoaded: boolean
}

export const FramePage = withStyles(styles)(
  class FramePage extends Component<FramePageProps, FramePageState> {
    private readonly frame: RefObject<HTMLIFrameElement>
    private cancelFrameListener?: () => void

    constructor(props: FramePageProps) {
      super(props)
      this.frame = createRef()
      this.state = {
        frameLoaded: false,
      }
    }

    componentDidMount() {
      if (this.frame.current == null) {
        throw new TypeError('The iframe element must not be null.')
      }

      try {
        this.cancelFrameListener = this.props.createFrameListener(this.frame.current)
      } catch {
        this.props.onCloseRequested()
      }
    }

    componentWillUnmount() {
      this.cancelFrameListener?.()
      this.cancelFrameListener = undefined
    }

    handleCloseRequested = () => {
      this.cancelFrameListener?.()
      this.cancelFrameListener = undefined

      this.props.onCloseRequested()
    }

    handleLoaded = () => {
      this.setState({
        frameLoaded: true,
      })
    }

    render() {
      const { onCloseRequested, frameSandbox, frameTitle, frameUrl, showWelcomeText, classes } = this.props
      const { frameLoaded } = this.state
      return (
        <Portal>
          <Overlay onCloseRequested={onCloseRequested} />
          <div className={classNames(classes.absoluteCenter, classes.container)}>
            {frameLoaded && showWelcomeText && (
              <NotMobile>
                <h1 className={classes.title}>Welcome to Salad!</h1>
              </NotMobile>
            )}
            <iframe
              ref={this.frame}
              className={classNames(classes.container, classes.iframeContainer)}
              onLoad={this.handleLoaded}
              sandbox={frameSandbox}
              src={frameUrl}
              title={frameTitle}
            />
            {frameLoaded && showWelcomeText && (
              <NotMobile>
                <P className={classes.subtitle}>
                  Each time you sign in to Salad, you’ll receive a fresh <br /> one-time code in your email. Using these
                  one-time codes helps <br /> protect your Salad balance and rewards.
                </P>
              </NotMobile>
            )}
            {frameLoaded ? null : (
              <img alt="Loading..." className={classNames(classes.absoluteCenter, classes.spinner)} src={logo} />
            )}
          </div>
        </Portal>
      )
    }
  },
)
