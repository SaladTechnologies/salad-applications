import React, { Component } from 'react'

// Packages
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

// Views
import { SmartStart } from './SmartStart'

// Models
import { Blacklist } from '../../machine/models/Blacklist'

storiesOf('Modules/SmartStart', module)
  // .add('Blacklist Items', () => {
  //   const blacklist: Blacklist[] = [
  //     { name: 'Battle.net', process: 'Battle.net.exe', enabled: true },
  //     { name: 'Epic Games Launcher', process: 'EpicGamesLauncher.exe', enabled: true },
  //     { name: 'MS Word', process: 'WINWORD.exe', enabled: true },
  //     { name: 'MS Excel', process: 'EXCEL.exe', enabled: true },
  //     { name: 'Steam', process: 'Steam.exe', enabled: true },
  //     { name: 'Uplay', process: 'upc.exe', enabled: true },
  //     { name: 'Origin', process: 'Origin.exe', enabled: true },
  //   ]

  //   return <SmartStart blacklist={blacklist} onClick={action('Show blacklist')} />
  // })
