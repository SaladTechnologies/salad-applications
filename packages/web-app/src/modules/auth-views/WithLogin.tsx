import React from 'react'
import { getStore } from '../../Store'
import { LoginPanelContainer } from './LoginPanelContainer'

interface Props {}

export const withLogin = <P extends object>(Component: React.ComponentType<P>, DefaultComponent?: any) =>
  class WithLogin extends React.Component<P & Props> {
    render() {
      const store = getStore()
      const { ...props } = this.props
      return store.auth.isAuth ? (
        <Component {...(props as P)} />
      ) : DefaultComponent ? (
        <DefaultComponent />
      ) : (
        <LoginPanelContainer />
      )
    }
  }
