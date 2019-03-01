import React from 'react'
import { storiesOf } from '@storybook/react'
import { ExperienceBar } from './ExperienceBar'
import { Level } from '../../xp/models/Level'
import { number, select } from '@storybook/addon-knobs'
import { SlicedVeggie } from './SlicedVeggie'
import { defaultLevels } from '../../xp/models/defaultLevels'

const levels = defaultLevels

storiesOf('Modules/XP', module)
  .add('XP Bar', () => {
    let xp = number('Current XP', 50, {
      range: true,
      min: 0,
      max: 1000,
      step: 1,
    })

    return (
      <div
        style={{
          backgroundColor: '#092234',
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          overflow: 'auto',
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 'auto', display: 'flex' }}>
          <div style={{ flexGrow: 1 }} className={'columns is-mobile'}>
            <div style={{ display: 'flex' }} className="column">
              <ExperienceBar currentXp={xp} levels={levels} />
            </div>
          </div>
        </div>
      </div>
    )
  })
  .add('Sliced Veggie', () => {
    let xp = number('XP Percent', 50, {
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
  })
