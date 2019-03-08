import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'
import { Tooltip } from './Tooltip'
import loremIpsum from 'lorem-ipsum'

storiesOf('Components/Tooltip', module)
  .add('with text and title', () => {
    const text = loremIpsum({ count: number('Sentences', 3) })
    return (
      <div>
        <Tooltip title={'Hello welcome to the tooltip'} text={text} />
      </div>
    )
  })
  .add('with text only', () => {
    return <Tooltip text={loremIpsum({ count: number('Sentences', 2) })} />
  })
