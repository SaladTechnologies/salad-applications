import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Segments } from './Segments'

const segmentOptions = [
  { name: "24 Hours", action: action("clicked 24 Hours") },
  { name: "7 Days", action: action("clicked 7 Days") },
  { name: "30 Days", action: action("clicked #0 Days") }
]

storiesOf('Components/Segments', module).add('default', () => {
  return (
    <div>
      <Segments options={segmentOptions} />
    </div>
  )
})
