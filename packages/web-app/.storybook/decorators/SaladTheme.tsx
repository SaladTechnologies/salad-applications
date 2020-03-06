import React from 'react'
import { ThemeProvider } from 'react-jss'
import { DefaultTheme } from '../../src/SaladTheme'
import { SkeletonTheme } from 'react-loading-skeleton'

export const SaladTheme = ({ children }) => (
  <ThemeProvider theme={DefaultTheme}>
    <SkeletonTheme color={'#172E40'} highlightColor="#304759">
      {children}
    </SkeletonTheme>
  </ThemeProvider>
)
