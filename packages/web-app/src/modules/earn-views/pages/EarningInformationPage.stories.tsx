import React from 'react'
import { EarningInformationPage } from './EarningInformationPage'

export default {
  title: 'Modules/Earn/pages/Earning Information Page',
  component: EarningInformationPage,
  decorators: [
    (storyFn: any) => <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>,
  ],
}

export const Empty = () => <EarningInformationPage />
