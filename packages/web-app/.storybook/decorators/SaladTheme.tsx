import React from 'react'
import { ThemeProvider } from 'react-jss'
import { DefaultTheme } from '../../src/SaladTheme'

export const SaladTheme = ({ children }) => <ThemeProvider theme={DefaultTheme}>{children}</ThemeProvider>
