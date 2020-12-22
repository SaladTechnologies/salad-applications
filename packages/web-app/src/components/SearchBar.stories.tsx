import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { SearchBar } from '.'

storiesOf('Components/Search Bar', module)
  .add('placeholder', () => {
    return <SearchBar text={undefined} onTextEntered={action('text entered')} />
  })
  .add('with text', () => {
    return <SearchBar text={'hello world'} onTextEntered={action('text entered')} />
  })
  .add('with error', () => {
    return <SearchBar text={'hello world'} onTextEntered={action('text entered')} error="Search unavailable" />
  })
