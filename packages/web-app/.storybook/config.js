import React from 'react'
import { configure, addDecorator, addParameters } from '@storybook/react'
import '@storybook/addon-console'
import '@storybook/addon-backgrounds/register'
import '../src/index.css'
import 'bulma/css/bulma.css'
import 'react-hint/css/index.css'
import { withKnobs } from '@storybook/addon-knobs'
import { ThemeProvider } from 'react-jss'
import { DefaultTheme } from '../src/SaladTheme'

//Global addons
addDecorator(storyFn => {
  return <ThemeProvider theme={DefaultTheme}>{storyFn()}</ThemeProvider>
})
addDecorator(withKnobs)

function loadStories() {
  const req = require.context('../src', true, /\.stories\.tsx$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
