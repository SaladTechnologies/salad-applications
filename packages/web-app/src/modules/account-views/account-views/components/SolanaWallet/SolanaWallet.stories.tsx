import { action } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import type { SolanaWalletSubmitStatus } from '../../../../solana-wallet'
import { SolanaWallet } from './SolanaWallet'

const submitStatuses: SolanaWalletSubmitStatus[] = ['unknown', 'loading', 'success', 'failure']

storiesOf('Modules/Account/AccountViews/components/SolanaWallet', module).add('default', () => {
  const hasWallet = boolean('Has Wallet', true)
  const walletAddress = hasWallet ? '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1' : undefined
  const submitStatus = select<SolanaWalletSubmitStatus>('submitStatus', submitStatuses, 'unknown')

  return (
    <div style={{ backgroundColor: '#0A2133', padding: 24 }}>
      <SolanaWallet
        walletAddress={walletAddress}
        isLoading={boolean('isLoading', false)}
        isLoadError={boolean('isLoadError', false)}
        submitStatus={submitStatus}
        loadWallet={action('loadWallet')}
        setWallet={action('setWallet')}
        clearWallet={action('clearWallet')}
        setSubmitStatus={action('setSubmitStatus')}
      />
    </div>
  )
})
