import React, { Component } from 'react'
import { SaladTheme } from '../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import classNames from 'classnames'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5000,
    backgroundColor: 'rgba(0, 0, 0, .9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {
  onCloseClicked?: () => void
}

const bgId = 'modal-bg' + Math.random()

class _ModalPage extends Component<Props> {
  handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { onCloseClicked } = this.props

    let tar = (e.target as any) as { id: string }

    console.log(tar.id)

    if (onCloseClicked && tar.id === bgId) {
      onCloseClicked()
    }
  }
  render() {
    const { classes, children } = this.props
    return (
      <div id={bgId} className={classNames(classes.container)} onClick={this.handleClose}>
        {children}
      </div>
    )
  }
}

export const ModalPage = withStyles(styles)(_ModalPage)
