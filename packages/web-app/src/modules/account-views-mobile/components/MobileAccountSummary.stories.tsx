import { Meta } from '@storybook/react'
import React from 'react'
import { MobileAccountSummary } from '.'

export default {
  title: 'Modules/Account-Mobile/components/Mobile Account Summary',
  component: MobileAccountSummary,
} as Meta

export const Empty = () => <MobileAccountSummary />
export const Complete = () => <MobileAccountSummary username={'Salad Bob'} />
