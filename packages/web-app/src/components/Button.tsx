import React, { ReactNode, Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import classnames from 'classnames'
import { AnimatedBorder } from './AnimatedBorder'

const styles = (theme: SaladTheme) => ({
  button: {
    display: 'block',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'center',
    textTransform: 'capitalize',
    userSelect: 'none',
    color: (props: Props) => (props.dark ? theme.blueFont : theme.offWhite),
    fontSize: '.625rem',
    fontFamily: 'sharpGroteskLight25',
    '&:hover': {
      opacity: 0.8,
    },
    '&:focus': {
      outline: 0,
    },
  },
  border: {
    '&:hover': {
      opacity: 0.8,
    },
  },
  enabled: {
    cursor: 'pointer',
  },
  disabled: {
    cursor: 'not-allowed',
  },
})

interface Props extends WithStyles<typeof styles> {
  type?: string
  dark?: boolean
  disabled?: boolean
  loading?: boolean
  children?: ReactNode
  className?: string
  onClick?: () => void
}

class _Button extends Component<Props> {
  handleClick = () => {
    const { loading, disabled, onClick } = this.props
    if (loading !== true && !disabled && onClick != null) {
      onClick()
    }
  }

  render() {
    const { dark, loading, className, type, classes, disabled, children } = this.props
    let enabled = !loading && !disabled
    return (
      <AnimatedBorder
        dark={dark}
        className={classnames(classes.border, {
          [classes.disabled]: !enabled,
          [classes.enabled]: enabled,
        })}
        animating={loading}
        onClick={this.handleClick}
      >
        <button
          type={type}
          className={classnames(classes.button, className, {
            [classes.disabled]: !enabled,
            [classes.enabled]: enabled,
          })}
        >
          {children}
        </button>
      </AnimatedBorder>
    )
  }
}

export const Button = withStyles(styles)(_Button)
