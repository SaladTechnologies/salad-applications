import { storiesOf } from '@storybook/react'
import { strapiJSON } from '../storybookUtils'
import { StorefrontPage } from './StorefrontPage'

storiesOf('Modules/Storefront/Pages', module)
  .addDecorator((storyFn) => (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add('Storefront Page', () => {
    // @ts-ignore
    return <StorefrontPage data={strapiJSON} />
  })
