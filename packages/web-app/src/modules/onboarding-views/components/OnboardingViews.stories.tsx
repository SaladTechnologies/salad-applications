import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { WhatsNewPage } from './WhatsNewPage'

storiesOf('Modules/Onboarding', module).add(`What's New Page`, () => {
  return <WhatsNewPage onNext={action('ok')} />
})
