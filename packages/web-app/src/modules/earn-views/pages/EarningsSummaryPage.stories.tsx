import { HardwareDetailSingleColumn, HardwareDetailTwoColumns } from '@saladtechnologies/garden-components'
import { action } from '@storybook/addon-actions'
import { number, select, text } from '@storybook/addon-knobs'
import { Meta, Story } from '@storybook/react'
import moment from 'moment'
import { useState } from 'react'
import { EarningWindow } from '../../balance/models'
import { EarningsSummaryPage, EarningsSummaryPageProps } from './EarningsSummaryPage'

const GPUDetails = () => {
  return (
    <>
      <HardwareDetailSingleColumn isText={true} label="Miner" detail="PhoenixMiner 5.6A..." />
      <HardwareDetailTwoColumns>
        <HardwareDetailSingleColumn isText={true} label="Algorithm" detail="Ethash" />
        <HardwareDetailSingleColumn isText={true} label="Hashrate" detail="43 Mh/s" />
      </HardwareDetailTwoColumns>
    </>
  )
}

const GPUDetailsNotDefined = () => {
  return (
    <>
      <HardwareDetailSingleColumn isText={true} label="Miner" detail={undefined} />
      <HardwareDetailTwoColumns>
        <HardwareDetailSingleColumn isText={true} label="Algorithm" detail={undefined} />
        <HardwareDetailSingleColumn isText={true} label="Hashrate" detail={undefined} />
      </HardwareDetailTwoColumns>
    </>
  )
}

const CPUDetails = () => {
  return (
    <>
      <HardwareDetailSingleColumn isText={true} label="Miner" detail="Xmrig" />
      <HardwareDetailTwoColumns>
        <HardwareDetailSingleColumn isText={true} label="Algorithm" detail="KawPow" />
        <HardwareDetailSingleColumn isText={true} label="Hashrate" detail="43 Mh/s" />
      </HardwareDetailTwoColumns>
    </>
  )
}

const CPUDetailsNotDefined = () => {
  return (
    <>
      <HardwareDetailSingleColumn isText={true} label="Miner" detail={undefined} />
      <HardwareDetailTwoColumns>
        <HardwareDetailSingleColumn isText={true} label="Algorithm" detail={undefined} />
        <HardwareDetailSingleColumn isText={true} label="Hashrate" detail={undefined} />
      </HardwareDetailTwoColumns>
    </>
  )
}

const VideoDetails = () => {
  return (
    <>
      <HardwareDetailSingleColumn isText={true} label="Protocol" detail="Video Something Something" />
      <HardwareDetailTwoColumns>
        <HardwareDetailSingleColumn isText={true} label="Encoding" detail="1080p" />
      </HardwareDetailTwoColumns>
    </>
  )
}

const VideoDetailsNotDefined = () => {
  return (
    <>
      <HardwareDetailSingleColumn isText={true} label="Protocol" detail={undefined} />
      <HardwareDetailTwoColumns>
        <HardwareDetailSingleColumn isText={true} label="Encoding" detail={undefined} />
      </HardwareDetailTwoColumns>
    </>
  )
}

export default {
  title: 'Modules/Earn/pages/Earnings Summary Page (New)',
  component: EarningsSummaryPage,
  description: 'The Earnings Summary Page',
  argTypes: {
    currentBalance: {
      defaultValue: number('Current Balance', 230.0128),
      description: 'The current balance a chef has at their disposal.',
    },
    lifetimeBalance: {
      defaultValue: number('Lifetime Balance', 353.3885),
      description: "The chef's lifetime balance earned with Salad.",
    },
    lifetimeXP: {
      defaultValue: text('Lifetime XP', '199,000'),
      description: "The chef's lifetime XP gained with Salad",
    },
    daysShowing: {
      defaultValue: select('Days Showing', { 'One Day': 1, 'Seven Days': 7, '30 Days': 30 }, 1),
      description: 'The days showing in the earning chart.',
    },
    hardwareDetected: {
      defaultValue: [
        {
          name: 'AMD Ryzen 9 5900X',
          setupHardwareButtonLabel: 'Start Earning',
          setupHardwareButtonClick: action('On Setup Hardware Button Click'),
          type: 'cpu',
          stats: [
            { label: 'Temperature', stat: '62° C' },
            { label: 'Utilization', stat: '100%' },
          ],
          workloads: [
            {
              name: 'CPU Mining',
              onClickFixError: action('On Fix CPU Mining Error'),
              hasError: false,
              details: <CPUDetails />,
            },
          ],
        },
        {
          name: 'NVIDIA RTX 3080',
          setupHardwareButtonLabel: 'Start Earning',
          setupHardwareButtonClick: action('On Setup Hardware Button Click'),
          type: 'gpu',
          stats: [
            { label: 'Temperature', stat: '62° C' },
            { label: 'Utilization', stat: '100%' },
          ],
          workloads: [
            {
              name: 'GPU Mining',
              onClickFixError: action('On Fix GPU Mining Error'),
              hasError: false,
              details: <GPUDetails />,
            },
            {
              name: 'Video Mining',
              onClickFixError: action('On Fix Video Mining Error'),
              hasError: false,
              details: <VideoDetails />,
            },
          ],
        },
      ],
      description: 'The list of workloads configured for the hardward listed.',
    },
    isNative: {
      defaultValue: true,
      description: 'A flag that determines whether the user is on the web or desktop app.',
    },
  },
} as Meta

const getEarningWindow = (days: 1 | 7 | 30): EarningWindow[] => {
  const data: EarningWindow[] = [...Array(96)].map((_, i) => {
    const timestamp =
      days === 1 ? moment().add(i * 15, 'm') : days === 7 ? moment().add(i * 4, 'h') : moment().add(i * 2, 'd')
    return {
      timestamp: timestamp,
      earnings: Math.random(),
    }
  })

  return data
}

const Template: Story<EarningsSummaryPageProps> = (args) => {
  const [daysShowing, selectDaysShowing] = useState<1 | 7 | 30>(1)

  args.viewLast24HR = () => selectDaysShowing(1)
  args.viewLast7Days = () => selectDaysShowing(7)
  args.viewLast30Days = () => selectDaysShowing(30)
  args.daysShowing = daysShowing
  args.earningHistory = args.earningHistory?.length === 0 ? args.earningHistory : getEarningWindow(daysShowing)

  return (
    <div>
      <EarningsSummaryPage {...args} />
    </div>
  )
}

export const Default: Story<EarningsSummaryPageProps> = Template.bind({})
Default.args = {}

export const WithoutEarningHistory: Story<EarningsSummaryPageProps> = Template.bind({})
WithoutEarningHistory.args = {
  earningHistory: [],
  hardwareDetected: [
    {
      name: 'AMD Ryzen 9 5900X',
      setupHardwareButtonLabel: 'Start Earning',
      setupHardwareButtonClick: action('On Setup Hardware Button Click'),
      type: 'cpu',
      stats: [
        { label: 'Temperature', stat: undefined },
        { label: 'Utilization', stat: undefined },
      ],
      workloads: [
        {
          name: 'CPU Mining',
          onClickFixError: action('On Fix CPU Mining Error'),
          hasError: false,
          details: <CPUDetailsNotDefined />,
        },
      ],
    },
    {
      name: 'NVIDIA RTX 3080',
      setupHardwareButtonLabel: 'Start Earning',
      setupHardwareButtonClick: action('On Setup Hardware Button Click'),
      type: 'gpu',
      stats: [
        { label: 'Temperature', stat: undefined },
        { label: 'Utilization', stat: undefined },
      ],
      workloads: [
        {
          name: 'GPU Mining',
          onClickFixError: action('On Fix GPU Mining Error'),
          hasError: false,
          details: <GPUDetailsNotDefined />,
        },
        {
          name: 'Video Mining',
          onClickFixError: action('On Fix Video Mining Error'),
          hasError: false,
          details: <VideoDetailsNotDefined />,
        },
      ],
    },
  ],
}

export const WithHardwareNotConfigured: Story<EarningsSummaryPageProps> = Template.bind({})
WithHardwareNotConfigured.args = {
  hardwareDetected: [
    {
      name: 'AMD Ryzen 9 5900X',
      setupHardwareButtonLabel: 'Start Earning',
      setupHardwareButtonClick: action('On Setup Hardware Button Click'),
      type: 'cpu',
      stats: [
        { label: 'Temperature', stat: '62° C' },
        { label: 'Utilization', stat: '100%' },
      ],
      workloads: [],
    },
    {
      name: 'NVIDIA RTX 3080',
      setupHardwareButtonLabel: 'Start Earning',
      setupHardwareButtonClick: action('On Setup Hardware Button Click'),
      type: 'gpu',
      stats: [
        { label: 'Temperature', stat: '62° C' },
        { label: 'Utilization', stat: '100%' },
      ],
      workloads: [
        {
          name: 'GPU Mining',
          onClickFixError: action('On Fix GPU Mining Error'),
          hasError: false,
          details: <GPUDetails />,
        },
        {
          name: 'Video Mining',
          onClickFixError: action('On Fix Video Mining Error'),
          hasError: false,
          details: <VideoDetails />,
        },
      ],
    },
  ],
}

export const WithManyHardwares: Story<EarningsSummaryPageProps> = Template.bind({})
WithManyHardwares.args = {
  hardwareDetected: [
    {
      name: 'AMD Ryzen 9 5900X',
      setupHardwareButtonLabel: 'Start Earning',
      setupHardwareButtonClick: action('On Setup Hardware Button Click'),
      type: 'cpu',
      stats: [
        { label: 'Temperature', stat: '62° C' },
        { label: 'Utilization', stat: '100%' },
      ],
      workloads: [],
    },
    {
      name: 'AMD Radeon RX 580',
      setupHardwareButtonLabel: 'Start Earning',
      setupHardwareButtonClick: action('On Setup Hardware Button Click'),
      type: 'gpu',
      stats: [
        { label: 'Temperature', stat: '62° C' },
        { label: 'Utilization', stat: '100%' },
      ],
      workloads: [
        {
          name: 'GPU Mining',
          onClickFixError: action('On Fix GPU Mining Error'),
          hasError: false,
          details: <GPUDetails />,
        },
        {
          name: 'Video Mining',
          onClickFixError: action('On Fix Video Mining Error'),
          hasError: false,
          details: <VideoDetails />,
        },
      ],
    },
    {
      name: 'ZOTAC NVIDIA RTX 2080 OC GAMING 10G VERY LONG NAME',
      setupHardwareButtonLabel: 'Start Earning',
      setupHardwareButtonClick: action('On Setup Hardware Button Click'),
      type: 'gpu',
      stats: [
        { label: 'Temperature', stat: '62° C' },
        { label: 'Utilization', stat: '100%' },
      ],
      workloads: [
        {
          name: 'GPU Mining',
          onClickFixError: action('On Fix GPU Mining Error'),
          hasError: false,
          details: <GPUDetails />,
        },
        {
          name: 'Video Mining',
          onClickFixError: action('On Fix Video Mining Error'),
          hasError: false,
          details: <VideoDetails />,
        },
      ],
    },
    {
      name: 'NVIDIA RTX 3080 Founders Edition',
      setupHardwareButtonLabel: 'Start Earning',
      setupHardwareButtonClick: action('On Setup Hardware Button Click'),
      type: 'gpu',
      stats: [
        { label: 'Temperature', stat: '62° C' },
        { label: 'Utilization', stat: '100%' },
      ],
      workloads: [
        {
          name: 'GPU Mining',
          onClickFixError: action('On Fix GPU Mining Error'),
          hasError: true,
          details: <GPUDetails />,
        },
        {
          name: 'Video Mining',
          onClickFixError: action('On Fix Video Mining Error'),
          hasError: false,
          details: <VideoDetails />,
        },
      ],
    },
    {
      name: 'NVIDIA RTX 3080 Founders Edition',
      setupHardwareButtonLabel: 'Start Earning',
      setupHardwareButtonClick: action('On Setup Hardware Button Click'),
      type: 'gpu',
      stats: [
        { label: 'Temperature', stat: '62° C' },
        { label: 'Utilization', stat: '100%' },
      ],
      workloads: [
        {
          name: 'GPU Mining',
          onClickFixError: action('On Fix GPU Mining Error'),
          hasError: true,
          details: <GPUDetails />,
        },
        {
          name: 'Video Mining',
          onClickFixError: action('On Fix Video Mining Error'),
          hasError: false,
          details: <VideoDetails />,
        },
      ],
    },
  ],
}

export const NotNative: Story<EarningsSummaryPageProps> = Template.bind({})
NotNative.args = {
  isNative: false,
}
