// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { observer } from 'mobx-react'
import { Component, ComponentType } from 'react'
import { getStore } from '../../Store'
import { LoginPanelContainer } from './LoginPanelContainer'

interface Props {}

export const withLogin = <P extends object>(WrappedComponent: ComponentType<P>, DefaultComponent?: any) => {
  @observer
  class WithLogin extends Component<P & Props> {
    render() {
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
