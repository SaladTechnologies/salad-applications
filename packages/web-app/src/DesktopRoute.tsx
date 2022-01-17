import { Component } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { getStore } from './Store'

interface Props extends RouteProps {
  component: any
}

/**
 * A React Router route that only is available when Salad is running in the desktop app
 */
export class DesktopRoute extends Component<Props> {
  render() {
    const { component: Component, ...rest } = this.props
    const store = getStore()
    const isDesktop = store.native.isNative
    return (
      <Route
        {...rest}
        render={(routeProps) =>
          isDesktop ? (
            <Component {...routeProps} />
          ) : (
            <Redirect
              to={{
                pathname: '/store',
              }}
            />
          )
        }
      />
    )
  }
}
