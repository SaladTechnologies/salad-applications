import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Overlay, Portal } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.darkBlue,
    border: 'none',
    boxShadow: `none`,
    color: 'white',
    height: 450,
    left: '50%',
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    width: 300,
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

    componentWillUnmount() {
      this.cancelFrameListener?.()
      this.cancelFrameListener = undefined
    }

    handleCloseRequested = () => {
      this.cancelFrameListener?.()
      this.cancelFrameListener = undefined

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
