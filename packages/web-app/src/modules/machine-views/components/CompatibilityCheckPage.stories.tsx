import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { CompatibilityCheckPage } from './CompatibilityCheckPage'

storiesOf('Modules|Machine/Compatibility Check', module)
  .add('is checking', () => <CompatibilityCheckPage isChecking />)
  .add('invalid gpus', () => (
    <CompatibilityCheckPage
      onNext={action('next')}
      validGPUs={false}
      validOS={true}
      gpuList={['Intel(R) UHD Graphics 630', 'NVIDIA GeForce GTX 1060 with Max-Q']}
    />
  ))
  .add('invalid os', () => <CompatibilityCheckPage onNext={action('next')} validGPUs={true} validOS={false} />)
