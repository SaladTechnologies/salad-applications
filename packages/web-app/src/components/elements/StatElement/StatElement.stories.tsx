import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import { StatElement } from './StatElement'
import { Tooltip } from '../../Tooltip'

storiesOf('Components/StatElement', module)
  .add('Title Only', () => {
    return <StatElement title="Title" />
  })
  .add('Single Value', () => {
    return <StatElement title="Title" values={['12345']} />
  })
  .add('Multiple Values', () => {
    return <StatElement title="Title" values={['12345', 'ABCDE']} />
  })
  .add('With Text Info, Disabled Info', () => {
    return <StatElement title="Title" values={['12345']} infoText={'Is this thing on??'} />
  })
  .add('With Text Info', () => {
    return <StatElement title="Title" values={['12345']} infoText={'Is this thing on??'} showInfo />
  })
  .add('With Tooltip Info', () => {
    return (
      <StatElement
        title="Title"
        values={['12345']}
        infoTooltip={<Tooltip title={'Title'} text={'Text goes here and such...'} />}
        showInfo
      />
    )
  })
