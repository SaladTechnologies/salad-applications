import { observer } from 'mobx-react'
import type { ComponentType, ReactNode } from 'react'
import { Component } from 'react'
import type { RootStore } from './Store'
import { getStore } from './Store'

export const connect = <T extends {}>(
  mapStoreToProps: (store: RootStore, ownProps?: any) => T,
  WrappedComponent: ComponentType<T>,
) => {
  @observer
  class ConnectedComponent extends Component<Partial<T>> {
    public static displayName = `connect(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    public override render(): ReactNode {
      const store = getStore()
      const nextProps = mapStoreToProps(store, this.props)
      return <WrappedComponent {...nextProps} />
    }
  }
  return ConnectedComponent
}
