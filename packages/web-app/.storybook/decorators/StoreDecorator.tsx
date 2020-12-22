import { createClient } from '../../src/axiosFactory'
import { createStore } from '../../src/Store'

const client = createClient()
createStore(client)

export const StoreDecorator = ({ children }) => children
