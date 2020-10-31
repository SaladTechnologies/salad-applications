import { Meta } from '@storybook/react'
import React from 'react'
import { MenuItem, Titlebar } from './Titlebar'

export default {
  title: 'Modules/Home/Title Bar',
  component: Titlebar,
} as Meta

const menuItems: MenuItem[] = [
  new MenuItem('Store', '/'),
  new MenuItem('Earn', '/earn/summary'),
  new MenuItem('Help', 'https://www.salad.io/support'),
]

export const IsDesktop = () => (
  <>
    Desktop
    <Titlebar menuItems={menuItems} isDesktop />
    Not Desktop
    <Titlebar menuItems={menuItems} />
  </>
)
