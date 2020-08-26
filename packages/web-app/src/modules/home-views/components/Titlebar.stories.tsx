import { action } from '@storybook/addon-actions'
import React from 'react'
import { MiningStatus } from '../../machine/models'
import { MenuItem, Titlebar } from './Titlebar'

export default {
  title: 'Modules/Home/Title Bar',
  component: Titlebar,
}
const menuItems: MenuItem[] = [
  new MenuItem('Store', '/'),
  new MenuItem('Earn', '/earn/summary'),
  new MenuItem('Help', 'https://www.salad.io/support'),
]

export const IsDesktop = () => (
  <>
    Desktop
    <Titlebar isDesktop />
    Not Desktop
    <Titlebar />
  </>
)

export const WithStart = () => (
  <>
    Desktop
    <Titlebar isDesktop onStart={action('start')} startEnabled menuItems={menuItems} />
    Not Desktop
    <Titlebar onStart={action('start')} startEnabled menuItems={menuItems} />
  </>
)

export const RunningStatus = () => (
  <>
    <Titlebar isDesktop onStart={action('start')} menuItems={menuItems} status={MiningStatus.Stopped} />
    <Titlebar isDesktop onStart={action('start')} menuItems={menuItems} status={MiningStatus.Initializing} />
  </>
)
