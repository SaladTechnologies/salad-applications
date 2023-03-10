import type { MouseEvent, ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../SaladTheme'

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
  children?: ReactNode
}

export const Overlay = withStyles(styles)(
  class Overlay extends Component<OverlayProps> {
    public override componentDidMount() {
      document.addEventListener('keydown', this.onKeyDown)
    }

    public override componentWillUnmount() {
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

    public override render(): ReactNode {
      return (
        <div className={this.props.classes.overlay} onClick={this.onClick}>
          {this.props.children}
        </div>
      )
    }
  },
)
