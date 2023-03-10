import { observer } from 'mobx-react'
import type { ComponentType, ReactNode } from 'react'
import { Component } from 'react'
import type { SaladPayStore } from '../salad-pay'
import { getSaladPayStore } from '../salad-pay'

export const connectSaladPay = <T extends {}>(
  mapStoreToProps: (store: SaladPayStore, ownProps?: any) => T,
  WrappedComponent: ComponentType<T>,
) => {
  @observer
  class ConnectedComponent extends Component<T> {
    public static displayName = `connect(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    public override render(): ReactNode {
      const store = getSaladPayStore()
      const nextProps = mapStoreToProps(store, this.props)
      return <WrappedComponent {...nextProps} />
    }
  }
  return ConnectedComponent
}
