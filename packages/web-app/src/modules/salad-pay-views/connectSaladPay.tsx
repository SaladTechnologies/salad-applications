// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { observer } from 'mobx-react'
import { Component, ComponentType } from 'react'
import { getSaladPayStore, SaladPayStore } from '../salad-pay'

export const connectSaladPay = <T extends {}>(
  mapStoreToProps: (store: SaladPayStore, ownProps?: any) => T,
  WrappedComponent: ComponentType<T>,
) => {
  @observer
  class ConnectedComponent extends Component<T> {
    public static displayName = `connect(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    render() {
      const store = getSaladPayStore()
      const nextProps = mapStoreToProps(store, this.props)
      return <WrappedComponent {...nextProps} />
    }
  }
  return ConnectedComponent
}
