import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import classnames from 'classnames'

const animationTime = 3
const borderWidth = 2
const glowWidth = 4

const styles = (theme: SaladTheme) => ({
  container: (props: Props) => ({
    display: 'inline-block',
    border: `${borderWidth}px solid ${props.dark ? theme.darkBlue : theme.lightGreen}`,
    position: 'relative',
    padding: `${borderWidth * 2}px`,
    margin: `${glowWidth * 2}px`,
  }),
  animation: {
    '&::before, &:after': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      content: '""',
      margin: `${-glowWidth * 2}px`,
      boxShadow: `inset 0 0 ${glowWidth}px 2px ${theme.mediumGreen}`,
      animation: `$borderAnim ${animationTime}s linear infinite`,
    },

    '&:before': {
      animationDelay: `${animationTime * -0.5}s`,
    },
  },
  '@keyframes fadein': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  '@keyframes borderAnim': {
    // Working borders
    '0%': { clipPath: `inset(0 0 calc(100% - ${glowWidth}px) 0)` },
    '25%': { clipPath: `inset(0 calc(100% - ${glowWidth}px) 0 0)` },
    '50%': { clipPath: `inset(calc(100% - ${glowWidth}px) 0 0 0)` },
    '75%': { clipPath: `inset(0 0 0 calc(100% - ${glowWidth}px))` },
    '100%': { clipPath: `inset(0 0 calc(100% - ${glowWidth}px) 0)` },
  },
})

interface Props extends WithStyles<typeof styles> {
  dark?: boolean
  animating?: boolean
  className?: string
  onClick?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined
}

class _AnimatedBorder extends Component<Props> {
  render() {
    const { onClick, animating, className, classes, children } = this.props
    return (
      <div onClick={onClick} className={classnames(className, classes.container, { [classes.animation]: animating })}>
        {children}
      </div>
    )
  }
}

export const AnimatedBorder = withStyles(styles)(_AnimatedBorder)
