import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { SearchBar } from '.'

storiesOf('Components/Search Bar', module)
  .add('placeholder', () => {
    return <SearchBar text={undefined} onTextEntered={action('text entered')} />
  })
  .add('with text', () => {
    return <SearchBar text={'hello world'} onTextEntered={action('text entered')} />
  })
