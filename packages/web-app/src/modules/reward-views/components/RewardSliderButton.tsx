import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { IconArrowRight, IconArrowLeft } from './assets'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'absolute',
    color: theme.lightGreen,
    top: 0,
    bottom: 0,
    width: 55,
    background: 'rgba(10, 33, 51, 0.75)',
    border: 0,
    outline: 0,
    padding: 0,
    zIndex: 4,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
  },
  arrow: {
    width: 15,
  },
  largeArrow: {
    width: 25,
  },
  left: {
    left: 0,
  },
  right: {
    right: 0,
  },
})

interface Props extends WithStyles<typeof styles> {
  onClick?: () => void
  direction: 'left' | 'right'
}

interface State {
  isHovering: boolean
}

class _RewardSliderButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isHovering: false,
    }
  }

  handleMouseEnter = () => {
    this.setState({
      isHovering: true,
    })
  }

  handleMouseLeave = () => {
    this.setState({
      isHovering: false,
    })
  }

  handleClick = () => {
    const { onClick } = this.props

    if (onClick) {
      onClick()
    }
  }

  render() {
    const { direction, classes } = this.props
    const { isHovering } = this.state

    return (
      <button
        className={classnames(classes.container, {
          [classes.left]: direction === 'left',
          [classes.right]: direction === 'right',
        })}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className={classnames({ [classes.arrow]: !isHovering, [classes.largeArrow]: isHovering })}>
          {direction === 'left' ? <IconArrowLeft /> : <IconArrowRight />}
        </div>
      </button>
    )
  }
}

export const RewardSliderButton = withStyles(styles)(_RewardSliderButton)
