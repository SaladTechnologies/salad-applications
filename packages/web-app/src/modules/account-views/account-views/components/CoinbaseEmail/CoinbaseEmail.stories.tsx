import { action } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import type { CoinbaseEmailSubmitError, CoinbaseEmailSubmitStatus } from '../../../../coinbase'
import { CoinbaseEmail } from './CoinbaseEmail'
import { CoinbaseEmailConfirmModal } from './CoinbaseEmailConfirmModal'

const submitStatuses: CoinbaseEmailSubmitStatus[] = ['unknown', 'loading', 'success', 'failure']
const submitErrors: CoinbaseEmailSubmitError[] = ['unknown', 'invalid', 'disabled']

storiesOf('Modules/Account/AccountViews/components/CoinbaseEmail', module)
  .add('default', () => {
    const hasEmail = boolean('Has Email', true)
    const email = hasEmail ? 'chef@example.com' : undefined
    const submitStatus = select<CoinbaseEmailSubmitStatus>('submitStatus', submitStatuses, 'unknown')
    const submitError = select<CoinbaseEmailSubmitError>('submitError', submitErrors, 'unknown')

    return (
      <div style={{ backgroundColor: '#0A2133', padding: 24 }}>
        <CoinbaseEmail
          email={email}
          isLoading={boolean('isLoading', false)}
          isLoadError={boolean('isLoadError', false)}
          submitStatus={submitStatus}
          submitError={submitError}
          loadEmail={action('loadEmail')}
          setEmail={action('setEmail')}
          clearEmail={action('clearEmail')}
          setSubmitStatus={action('setSubmitStatus')}
        />
      </div>
    )
  })
  .add('confirm modal', () => (
    <CoinbaseEmailConfirmModal email="chef@example.com" onConfirm={action('onConfirm')} onCancel={action('onCancel')} />
  ))
