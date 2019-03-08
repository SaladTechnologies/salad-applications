import React from 'react'
import { observer } from 'mobx-react'
import { RootStore, getStore } from './Store'

export const connect = <T extends {}>(
  mapStoreToProps: (store: RootStore, ownProps?: any) => T,
  WrappedComponent: React.ComponentType<T>,
) => {
  @observer
  class ConnectedComponent extends React.Component<T> {
    public static displayName = `connect(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    render() {
      const store = getStore()
      const nextProps = mapStoreToProps(store, this.props)
      return <WrappedComponent {...nextProps} />
    }
  }
  return ConnectedComponent
}
