import React from 'react'
import { observer } from 'mobx-react'
import { getSaladPayStore, SaladPayStore } from '../salad-pay'

export const connectSaladPay = <T extends {}>(
  mapStoreToProps: (store: SaladPayStore, ownProps?: any) => T,
  WrappedComponent: React.ComponentType<T>,
) => {
  @observer
  class ConnectedComponent extends React.Component<T> {
    public static displayName = `connect(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    render() {
      const store = getSaladPayStore()
      const nextProps = mapStoreToProps(store, this.props)
      return <WrappedComponent {...nextProps} />
    }
  }
  return ConnectedComponent
}
