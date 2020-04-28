import React from 'react'
import { Level } from '../../xp/models/Level'
import { number, select } from '@storybook/addon-knobs'
import { SlicedVeggie } from './SlicedVeggie'
import { defaultLevels } from '../../xp/models/defaultLevels'

export default {
  title: 'Modules/XP/Sliced Veggie',
  component: SlicedVeggie,
}

const levels = defaultLevels

export const Basic = () => {
  let xp = number('XP Percent', 0.5, {
    range: true,
    min: 0,
    max: 1,
    step: 0.01,
  })

  let options: any = {}
  for (var l of levels) {
    options[l.title] = l
  }

  let selectedLevel = (select('Veggie', options, levels[0] as any) as any) as Level

  return (
    <div>
      <SlicedVeggie percent={xp} level={selectedLevel} />
    </div>
  )
}
