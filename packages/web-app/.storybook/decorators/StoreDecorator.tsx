import React from 'react'
import { ThemeProvider } from 'react-jss'
import { DefaultTheme } from '../../src/SaladTheme'
import { SkeletonTheme } from 'react-loading-skeleton'
import { createClient } from '../../src/axiosFactory'
import { createStore } from '../../src/Store'

const client = createClient()
createStore(client)

export const StoreDecorator = ({ children }) => children
