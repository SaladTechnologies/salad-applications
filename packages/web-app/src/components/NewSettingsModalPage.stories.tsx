import React from 'react'
import { storiesOf } from '@storybook/react'
import { SettingsModalPage } from './NewSettingsModalPage'
import './../pagedraw/settings.css';

//fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)

storiesOf('NewSettingsPage', module)
  .add('Main', () => {
    return (
    <svg width="400" height="110">
        <rect width="300" height="100" />
    </svg>);
    
  })
  .add('with fallback', () => {
    return <SettingsModalPage />
  })