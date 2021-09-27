import { createClient } from '../../src/axiosFactory'
import { FeatureManagerProvider, UnleashFeatureManager } from '../../src/FeatureManager'
import { createStore } from '../../src/Store'

const client = createClient()
const featureManager = new UnleashFeatureManager()
createStore(client, featureManager)

export const StoreDecorator = ({ children }) => (
  <FeatureManagerProvider value={featureManager}>{children}</FeatureManagerProvider>
)
