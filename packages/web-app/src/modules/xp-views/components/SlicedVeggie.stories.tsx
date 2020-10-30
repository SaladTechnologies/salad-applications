import { number, select } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react'
import React from 'react'
import { defaultLevels } from '../../xp/models/defaultLevels'
import { Level } from '../../xp/models/Level'
import { SlicedVeggie } from './SlicedVeggie'

export default {
  title: 'Modules/XP/Sliced Veggie',
  component: SlicedVeggie,
} as Meta

const levels = defaultLevels()

export const Basic = () => {
  let xp = number('XP Percent', 0.5, {
    range: true,
    min: 0,
    max: 1,
    step: 0.01,
  })

  let options: any = {}
  for (var l of levels) {
    options[l.key] = l
  }

  let selectedLevel = (select('Veggie', options, levels[0] as any) as any) as Level

  return (
    <div style={{ paddingTop: 200 }}>
      <SlicedVeggie percent={xp} level={selectedLevel} />
    </div>
  )
}
