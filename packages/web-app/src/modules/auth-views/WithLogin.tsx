import { observer } from 'mobx-react'
import type { ComponentType, ReactNode } from 'react'
import { Component } from 'react'
import { getStore } from '../../Store'
import { LoginPanelContainer } from './LoginPanelContainer'

interface Props {}

export const withLogin = <P extends object>(WrappedComponent: ComponentType<P>, DefaultComponent?: any) => {
  @observer
  class WithLogin extends Component<P & Props> {
    public override render(): ReactNode {
      const store = getStore()
      const { ...props } = this.props
      return store.auth.isAuthenticated ? (
        <WrappedComponent {...(props as P)} />
      ) : DefaultComponent ? (
        <DefaultComponent />
      ) : (
        <LoginPanelContainer />
      )
    }
  }
  return WithLogin
}
