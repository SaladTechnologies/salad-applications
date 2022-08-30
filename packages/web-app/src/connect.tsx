// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { observer } from 'mobx-react'
import { Component, ComponentType } from 'react'
import { getStore, RootStore } from './Store'

export const connect = <T extends {}>(
  mapStoreToProps: (store: RootStore, ownProps?: any) => T,
  WrappedComponent: ComponentType<T>,
) => {
  @observer
  class ConnectedComponent extends Component<Partial<T>> {
    public static displayName = `connect(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    render() {
      const store = getStore()
      const nextProps = mapStoreToProps(store, this.props)
      return <WrappedComponent {...nextProps} />
    }
  }
  return ConnectedComponent
}
