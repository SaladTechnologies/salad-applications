import classNames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Overlay, Portal } from '../../../components'
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
    height: 450,
    margin: 0,
    padding: 0,
    width: 300,
    // TODO: Remove z-indexes!!!
    zIndex: 9999999999,
  },
  spinner: {
    width: '2vw',
    zIndex: 99999999999,
  },
})

interface FramePageProps extends WithStyles<typeof styles> {
  createFrameListener: (frame: HTMLIFrameElement, timeout?: number) => () => void
  frameSandbox?: string
  frameTitle: string
  frameUrl: string
  onCloseRequested: () => void
}

interface FramePageState {
  frameLoaded: boolean
}

export const FramePage = withStyles(styles)(
  class FramePage extends Component<FramePageProps, FramePageState> {
    private readonly frame: React.RefObject<HTMLIFrameElement>
    private cancelFrameListener?: () => void

    constructor(props: FramePageProps) {
      super(props)
      this.frame = React.createRef()
      this.state = {
        frameLoaded: false,
      }
    }

    componentDidMount() {
      if (this.frame.current == null) {
        throw new TypeError('The iframe element must not be null.')
      }

      this.cancelFrameListener = this.props.createFrameListener(this.frame.current)
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
      return (
        <Portal>
          <Overlay onCloseRequested={this.props.onCloseRequested} />
          <iframe
            ref={this.frame}
            className={classNames(this.props.classes.absoluteCenter, this.props.classes.container)}
            onLoad={this.handleLoaded}
            sandbox={this.props.frameSandbox}
            src={this.props.frameUrl}
            title={this.props.frameTitle}
          />
          {this.state.frameLoaded ? null : (
            <img
              alt="Loading..."
              className={classNames(this.props.classes.absoluteCenter, this.props.classes.spinner)}
              src={logo}
            />
          )}
        </Portal>
      )
    }
  },
)
