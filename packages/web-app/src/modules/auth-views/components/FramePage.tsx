import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Overlay, Portal } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.darkBlue,
    border: '1px solid rgba(187, 187, 187, 1)',
    boxShadow: '0 0 10px rgba(187, 187, 187, 1)',
    color: 'white',
    height: '70vh',
    left: '50%',
    margin: 0,
    minHeight: 400,
    minWidth: 250,
    padding: 0,
    position: 'absolute',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    width: '50vw',
    // TODO: Remove z-indexes!!!
    zIndex: 9999999999,
  },
})

interface FramePageProps extends WithStyles<typeof styles> {
  createFrameListener: (frame: HTMLIFrameElement, timeout?: number) => () => void
  frameSandbox?: string
  frameTitle: string
  frameUrl: string
  onCloseRequested: () => void
}

export const FramePage = withStyles(styles)(
  class FramePage extends Component<FramePageProps> {
    private readonly frame: React.RefObject<HTMLIFrameElement>
    private cancelFrameListener?: () => void

    constructor(props: FramePageProps) {
      super(props)
      this.frame = React.createRef()
    }

    componentDidMount() {
      if (this.frame.current == null) {
        throw new TypeError('The iframe element must not be null.')
      }

      this.cancelFrameListener = this.props.createFrameListener(this.frame.current)
    }

    handleCloseRequested = () => {
      this.cancelFrameListener?.()
      this.props.onCloseRequested()
    }

    render() {
      return (
        <Portal>
          <Overlay onCloseRequested={this.props.onCloseRequested} />
          <iframe
            ref={this.frame}
            className={this.props.classes.container}
            sandbox={this.props.frameSandbox}
            src={this.props.frameUrl}
            title={this.props.frameTitle}
          />
        </Portal>
      )
    }
  },
)
