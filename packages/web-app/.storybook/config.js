import { configure, addDecorator } from '@storybook/react'
import React from 'react'
import '@storybook/addon-console'
import '../src/index.css'
import 'bulma/css/bulma.css'
import { withKnobs } from '@storybook/addon-knobs'
import { ThemeDecorator } from './ThemeDecorator'

//Global addons
addDecorator(ThemeDecorator)
addDecorator(withKnobs)

function loadStories() {
  const req = require.context('../src', true, /\.stories\.tsx$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
