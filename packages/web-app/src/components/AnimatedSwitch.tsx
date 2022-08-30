import { Component, ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Route, Switch } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const animationTime = 1000

const styles = {
  enter: {
    transform: 'translate(100%)',
  },
  enterActive: {
    transform: 'translate(0%)',
    transition: `transform  ${animationTime}ms ease-in-out`,
  },
  exit: {
    transform: 'translate(0%)',
  },
  exitActive: {
    transform: 'translate(-100%)',
    transition: `transform  ${animationTime}ms ease-in-out`,
  },
}

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

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
