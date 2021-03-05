import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StorefrontPage } from './pages/StorefrontPage'

const mapStoreToProps = (store: RootStore): any => ({
  data: store.storefront.data,
  isLoading: store.storefront.isLoading,
})

export const StorefrontPageContainer = connect(mapStoreToProps, StorefrontPage)
