import { createClient } from '../../src/axiosFactory'
import { UnleashFeatureManager } from '../../src/FeatureManager'
import { createStore } from '../../src/Store'

const client = createClient()
const featureManager = new UnleashFeatureManager()
createStore(client, featureManager)

export const StoreDecorator = ({ children }) => children
