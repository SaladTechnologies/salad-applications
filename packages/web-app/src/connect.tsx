import React from 'react'
import { observer } from 'mobx-react'
import { RootStore, getStore } from './Store'

export type MapStoreToProps = (store: RootStore) => {}

export const connect = (mapStoreToProps: MapStoreToProps, WrappedComponent: React.ComponentType) => {
  @observer
  class ConnectedComponent extends React.Component {
    public static displayName = `connect(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    render() {
      const store = getStore()
      const props = mapStoreToProps(store)
      return <WrappedComponent {...props} />
    }
  }
  return ConnectedComponent
}
