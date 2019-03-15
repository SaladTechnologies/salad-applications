import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Switch, Route } from 'react-router'

const animationTime = 1000

const styles = (theme: SaladTheme) => ({
  enter: {
    // opacity: 0,
    transform: 'translate(100%)',
  },
  enterActive: {
    // opacity: 1,
    // transition: `opacity ${animationTime}ms ease-in`,
    transform: 'translate(0%)',
    transition: `transform  ${animationTime}ms ease-in-out`,
  },
  exit: {
    // opacity: 1,
    transform: 'translate(0%)',
  },
  exitActive: {
    transform: 'translate(-100%)',
    transition: `transform  ${animationTime}ms ease-in-out`,
    // opacity: 0,
    // transition: `opacity ${animationTime}ms ease-in`,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _AnimatedSwitch extends Component<Props> {
  render() {
    const { classes, children } = this.props

    return (
      <Route
        render={({ location }) => (
          <TransitionGroup>
            <CSSTransition
              key={location.key}
              timeout={animationTime}
              classNames={{
                enter: classes.enter,
                enterActive: classes.enterActive,
                exit: classes.exit,
                exitActive: classes.exitActive,
              }}
            >
              <Switch location={location}>{children}</Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      />
    )
  }
}

export const AnimatedSwitch = withStyles(styles)(_AnimatedSwitch)
