import { withKnobs } from '@storybook/addon-knobs'
import { addDecorator } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Border } from './decorators/Border'
import { DisableUserSelect } from './decorators/DisableUserSelect'
import { SaladTheme } from './decorators/SaladTheme'
import { GardenTheme } from './decorators/GardenTheme'
import { StoreDecorator } from './decorators/StoreDecorator'
import { TooltipDecorator } from './decorators/TooltipDecorator'

// Import CSS. Order is important!
import '../src/index.css'
import 'react-hint/css/index.css'

addDecorator(withKnobs)
addDecorator((storyFn) => <StoreDecorator>{storyFn()}</StoreDecorator>)
addDecorator((storyFn) => <TooltipDecorator>{storyFn()}</TooltipDecorator>)
addDecorator((storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>)
addDecorator((storyFn) => <DisableUserSelect>{storyFn()}</DisableUserSelect>)
addDecorator((storyFn) => <SaladTheme>{storyFn()}</SaladTheme>)
addDecorator((storyFn) => <GardenTheme>{storyFn()}</GardenTheme>)
addDecorator((storyFn) => <Border>{storyFn()}</Border>)
