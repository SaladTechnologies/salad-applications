import React from 'react'
import { addDecorator } from '@storybook/react'
import { Border } from './decorators/Border'
import { DisableUserSelect } from './decorators/DisableUserSelect'
import { SaladTheme } from './decorators/SaladTheme'
import '../src/index.css'
import 'react-hint/css/index.css'

addDecorator(storyFn => <DisableUserSelect>{storyFn()}</DisableUserSelect>)
addDecorator(storyFn => <SaladTheme>{storyFn()}</SaladTheme>)
addDecorator(storyFn => <Border>{storyFn()}</Border>)
