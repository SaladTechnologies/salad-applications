import React from 'react'
import { storiesOf } from '@storybook/react'
import { InfoButton } from './InfoButton'
// import { Tooltip } from '../../Tooltip'

storiesOf('Components/InfoButton', module).add('with text', () => (
  <InfoButton text={'This is a test of a help button'} />
))
// .add('with tooltip', () => (
//   <InfoButton tooltip={<Tooltip title="Hello" text={'World, boom'} />} text={'This is a test of a help button'} />
// ))
// .add('with both', () => (
//   <InfoButton
//     tooltip={<Tooltip title="Hello" text={'World, boom'} />}
//     text={'This wont be seen because of the tool tip'}
//   />
// ))
