import React from 'react'
import { addDecorator } from '@storybook/react'
import { Border } from './decorators/Border'
import { DisableUserSelect } from './decorators/DisableUserSelect'
import { SaladTheme } from './decorators/SaladTheme'
import { TooltipDecorator } from './decorators/TooltipDecorator'
import { MemoryRouter } from 'react-router-dom'
import '../src/index.css'
import 'react-hint/css/index.css'

addDecorator((storyFn) => <TooltipDecorator>{storyFn()}</TooltipDecorator>)
addDecorator((storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>)
addDecorator((storyFn) => <DisableUserSelect>{storyFn()}</DisableUserSelect>)
addDecorator((storyFn) => <SaladTheme>{storyFn()}</SaladTheme>)
addDecorator((storyFn) => <Border>{storyFn()}</Border>)
