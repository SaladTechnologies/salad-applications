import React from 'react'
import { getStore } from '../../Store'
import { LoginPanelContainer } from './LoginPanelContainer'

interface Props {
  loading: boolean
}

export const withLogin = <P extends object>(Component: React.ComponentType<P>) =>
  class WithLogin extends React.Component<P & Props> {
    render() {
      const store = getStore()
      debugger
      const { ...props } = this.props
      return store.auth.isAuth ? <Component {...(props as P)} /> : <LoginPanelContainer />
    }
  }
