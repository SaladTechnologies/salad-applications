import React from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import classnames from 'classnames'
import { ProgressBar } from '.'

const styles = (theme: SaladTheme) => ({
  progressBackground: {
    position: 'relative',
    backgroundColor: theme.darkBlue,
    height: '3px',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: theme.green,
    boxShadow: `0px 0px 4px 0px ${theme.green}`,
  },
  '@keyframes animated': {
    '0%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
  cylonGlow: {
    backgroundColor: theme.green,
    background: `linear-gradient(90deg, rgba(255,0,0,0) 40%, white ,rgba(255,0,0,0) 60%)`,
    backgroundSize: '200%',
    animationName: '$animated',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
  },
})

interface Props extends WithStyles<typeof styles> {
  progress?: number
}

const _AnimatedProgressBar = ({ progress, classes }: Props) => (
  <ProgressBar
    className={classes.progressBackground}
    barClassName={classnames(classes.progressBar, classes.cylonGlow)}
    progress={progress}
  />
)

export const AnimatedProgressBar = withStyles(styles)(_AnimatedProgressBar)
