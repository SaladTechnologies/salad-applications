import { StorefrontCommunityChallengeProps } from '../../storefront/models'
import { StorefrontCommunityChallengePanel } from '../components'

interface Props {
  block: StorefrontCommunityChallengeProps
}

type ReportData = {
  progress?: {
    all?: number
  }
}

export const StorefrontCommunityChallengeBlock = ({ block }: Props) => {
  const reportData: ReportData = JSON.parse(block.data?.data || '')

  return (
    <StorefrontCommunityChallengePanel
      body={block.content}
      title={block.heading}
      progress={reportData?.progress?.all}
    />
  )
}
