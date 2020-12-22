import { Component, MouseEvent } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  overlay: {
    backdropFilter: 'blur(25px)',
    backgroundColor: theme.darkBlue,
    backgroundBlendMode: 'multiply',
    bottom: 0,
    display: 'flex',
    left: 0,
    opacity: '75%',
    position: 'absolute',
    right: 0,
    top: 0,
    // TODO: Remove z-indexes!!!
    zIndex: 9999999998,
  },
})

export interface OverlayProps extends WithStyles<typeof styles> {
  onCloseRequested?: () => void
}

export const Overlay = withStyles(styles)(
  class Overlay extends Component<OverlayProps> {
    componentDidMount() {
      document.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.onKeyDown)
    }

    onClick = (event: MouseEvent<HTMLDivElement>) => {
      if (event.currentTarget !== event.target) {
        // Ignore clicks on descendent elements.
        return
      }

      this.props.onCloseRequested?.()
    }

    onKeyDown = (event: KeyboardEvent) => {
      // Detect "Escape" key presses.
      if (event.keyCode === 27) {
        this.props.onCloseRequested?.()
      }
    }

    render() {
      return (
        <div className={this.props.classes.overlay} onClick={this.onClick}>
          {this.props.children}
        </div>
      )
    }
  },
)
