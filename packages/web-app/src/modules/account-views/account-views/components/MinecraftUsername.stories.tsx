import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { MinecraftUsername } from './MinecraftUsername'

storiesOf('Modules/Account/AccountViews/components/MinecraftUsername', module).add('default', () => {
  const hasUsername = boolean('Has Minecraft Username', true)
  const username = hasUsername ? 'minecrafter_3000' : undefined
  const onUpdateUsername = action('Update Username')
  return (
    <div style={{ backgroundColor: '#0A2133' }}>
      <MinecraftUsername username={username} onUpdate={onUpdateUsername} isUpdating={boolean('isUpdating', false)} />
    </div>
  )
})
