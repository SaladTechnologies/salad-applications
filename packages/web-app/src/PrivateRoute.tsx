import React, { Component } from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'

interface Props extends RouteProps {
  component: any
  isSignedIn: boolean
}

export class PrivateRoute extends Component<Props> {
  render() {
    const { component: Component, isSignedIn, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={(routeProps) => (
          <>
            <Component {...routeProps} />
            {!isSignedIn && (
              <Redirect
                push
                to={{
                  pathname: '/login',
                  state: { currentLocation: routeProps.location },
                }}
              />
            )}
          </>
        )}
      />
    )
  }
}
