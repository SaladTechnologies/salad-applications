import type { Meta } from '@storybook/react'
import { MiningInformation } from '.'

export default {
  title: 'Modules/Earn/components/Mining Information',
  component: MiningInformation,
  decorators: [
    (storyFn: any) => <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>,
  ],
} as Meta

export const IncompatibleGPUAndOS = () => <MiningInformation isNative={false} />
