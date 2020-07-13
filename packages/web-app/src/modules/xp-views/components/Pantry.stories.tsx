import React from 'react'
import { number } from '@storybook/addon-knobs'
import { Pantry } from './Pantry'
import { defaultLevels } from '../../xp/models/defaultLevels'

export default {
  title: 'Modules/XP/Pantry',
  component: Pantry,
}

const levels = defaultLevels()

export const Basic = () => {
  let xp = number('Current XP', 0, {
    range: true,
    min: 0,
    max: 150000,
    step: 1,
  })

  let options: any = {}
  for (var l of levels) {
    options[l.key] = l
  }

  return <Pantry currentXp={xp} levels={levels} />
}
