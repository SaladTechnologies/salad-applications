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
        render={(routeProps) =>
          isSignedIn ? (
            <Component {...routeProps} />
          ) : (
            <Redirect
              to={{
                pathname: '/signin',
                state: { currentRoute: document.location.pathname },
              }}
            />
          )
        }
      />
    )
  }
}

// export class PrivateRoute extends Component<Props> {
//     async componentDidMount() {
//       const { store } = this.props

//       if (store.auth.isAuth) {
//         return
//       }

//       try {
//         await store.auth.signIn()
//       } catch (err) {
//         console.error(err)
//       }
//     }

//     render() {
//       const { component: Component, ...rest } = this.props
//       return <Route {...rest} render={(routeProps) => <Component {...routeProps} />} />
//     }
//   }
