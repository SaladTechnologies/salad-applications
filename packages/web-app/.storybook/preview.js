import React from 'react'
import { addDecorator } from '@storybook/react'
import { Border } from './decorators/Border'
import { DisableUserSelect } from './decorators/DisableUserSelect'
import { SaladTheme } from './decorators/SaladTheme'
import { TooltipDecorator } from './decorators/TooltipDecorator'
import { StoreDecorator } from './decorators/StoreDecorator'
import { MemoryRouter } from 'react-router-dom'
import { withKnobs } from '@storybook/addon-knobs'
import '../src/index.css'
import 'react-hint/css/index.css'

addDecorator(withKnobs)
addDecorator((storyFn) => <StoreDecorator>{storyFn()}</StoreDecorator>)
addDecorator((storyFn) => <TooltipDecorator>{storyFn()}</TooltipDecorator>)
addDecorator((storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>)
addDecorator((storyFn) => <DisableUserSelect>{storyFn()}</DisableUserSelect>)
addDecorator((storyFn) => <SaladTheme>{storyFn()}</SaladTheme>)
addDecorator((storyFn) => <Border>{storyFn()}</Border>)
