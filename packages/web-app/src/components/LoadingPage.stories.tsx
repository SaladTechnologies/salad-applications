import { storiesOf } from '@storybook/react'
import { LoadingPage } from './LoadingPage'

storiesOf('Components/Loading Page', module).add('default', () => {
  return <LoadingPage text={'Hello storybook'} />
})
