import React from 'react'
import { storiesOf } from '@storybook/react'
import { SaladPayPage } from './SaladPayPage'
import { SaladPayOrderSummaryPage } from '.'
import { SaladPaymentRequestOptions } from '../../salad-pay/models'
import { action } from '@storybook/addon-actions'
import { SaladPayCheckoutButton } from './SaladPayCheckoutButton'

export const fullRequest: SaladPaymentRequestOptions = {
  total: {
    label: 'Total',
    amount: 0.72,
  },
  displayItems: [
    {
      label: 'Name of Item Purchased',
      amount: 0.62,
    },
    {
      label: 'Optional Vendor Fee',
      amount: 0.04,
    },
    {
      label: 'Optional Payment Processing Fee',
      amount: 0.06,
    },
  ],
}

export const requestWithoutItems: SaladPaymentRequestOptions = {
  total: {
    label: 'Total',
    amount: 0.72,
  },
}

/**
 * SaladPayPage
 */
storiesOf('Salad Pay/Components/Salad Pay Page', module)
  .add('blank page', () => {
    return <SaladPayPage onClose={action('close')} />
  })
  .add('example page', () => {
    return (
      <SaladPayPage onClose={action('close')}>
        <div style={{ height: 100, backgroundColor: 'blue' }}>Hello world</div>
      </SaladPayPage>
    )
  })
  .add('example page - overflow', () => {
    return (
      <SaladPayPage onClose={action('close')}>
        <div style={{ height: 1000, backgroundColor: 'blue' }}>Hello world</div>
      </SaladPayPage>
    )
  })

/**
 * SaladPayOrderSummaryPage
 */
storiesOf('Salad Pay/Components/Order Summary Page', module)
  .add('invalid request', () => {
    return <SaladPayOrderSummaryPage onClose={action('close')} />
  })
  .add('request without items', () => {
    return (
      <SaladPayOrderSummaryPage
        request={requestWithoutItems}
        availableBalance={20.08}
        onConfirm={action('confirm')}
        onClose={action('close')}
      />
    )
  })
  .add('complete request', () => {
    return (
      <SaladPayOrderSummaryPage
        request={fullRequest}
        availableBalance={20.08}
        onConfirm={action('confirm')}
        onClose={action('close')}
      />
    )
  })
  .add('processing request', () => {
    return (
      <SaladPayOrderSummaryPage
        request={fullRequest}
        availableBalance={20.08}
        onConfirm={action('confirm')}
        onClose={action('close')}
        processing
      />
    )
  })
  .add('insufficient balance', () => {
    return (
      <SaladPayOrderSummaryPage
        request={fullRequest}
        availableBalance={0.01}
        onConfirm={action('confirm')}
        onClose={action('close')}
      />
    )
  })

/**
 * SaladPayCheckoutButton
 */
storiesOf('Salad Pay/Components/Checkout Button', module)
  .addDecorator((storyFn) => <div style={{ backgroundColor: 'white' }}>{storyFn()}</div>)
  .add('default', () => {
    return <SaladPayCheckoutButton enabled={true} onClick={action('click')} />
  })
  .add('disabled', () => {
    return <SaladPayCheckoutButton enabled={false} onClick={action('click')} />
  })
  .add('loading', () => {
    return <SaladPayCheckoutButton enabled={false} loading onClick={action('click')} />
  })
