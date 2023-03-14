import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.green,
    width: '25rem',
    padding: '1rem .5rem',
    position: 'relative',
    userSelect: 'none',
  },
  closeButton: {
    color: theme.darkBlue,
    position: 'absolute',
    right: '.5rem',
    top: '.25rem',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  content?: ReactNode
  visible?: boolean
  onCloseClicked?: () => void
  width?: number
  children?: ReactNode
}

class _Modal extends Component<Props> {
  handleClose = () => {
    const { onCloseClicked } = this.props
    if (onCloseClicked) {
      onCloseClicked()
    }
  }
  public override render(): ReactNode {
    const { onCloseClicked, classes, children, width } = this.props
    return (
      <div className={classNames(classes.container)} style={width ? { width: width } : undefined}>
        {onCloseClicked && (
          <div className={classes.closeButton} onClick={this.handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        )}
        {children}
      </div>
    )
  }
}

export const Modal = withStyles(styles)(_Modal)
