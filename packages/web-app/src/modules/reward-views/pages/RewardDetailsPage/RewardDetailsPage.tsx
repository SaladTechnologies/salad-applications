import type { FC } from 'react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Head, Scrollbar } from '../../../../components'
import { useOgMetaTags } from '../../../../hooks/useOgMetaTags'
import type { SaladTheme } from '../../../../SaladTheme'
import type { Reward } from '../../../reward/models'
import {
  RewardDescriptionPanel,
  RewardDisclaimers,
  RewardHeaderBar,
  RewardHowToPanel,
  RewardImageCarousel,
  RewardInfoPanel,
  RewardRequirementsPanel,
} from '../../components'
import { ReviewAfterRedemptionContainer } from './ReviewAfterRedemption/ReviewAfterRedemptionContainer'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.darkBlue,
    color: theme.lightGreen,
  },
  scrollContent: {
    paddingBottom: 100,
  },
})

interface Props extends WithStyles<typeof styles> {
  rewardId?: string
  reward?: Reward
  currentBalance?: number
  authenticated?: boolean
  requiresMinecraftUsername: boolean
  requiresSaladCard: boolean
  requiresPayPalAccount: boolean
  isTargetReward: boolean
  isReviewing: boolean
  loadReward?: (id?: string) => void
  onRedeem?: (reward?: Reward) => void
  onBack?: () => void
  onRemoveTargetRewardClick: () => void
  trackDisabledBuyNowClick: () => void
  onTargetThisRewardClick: (reward: Reward) => void
}

const _RewardDetailsPage: FC<Props> = ({
  classes,
  rewardId,
  reward,
  requiresMinecraftUsername,
  requiresSaladCard,
  requiresPayPalAccount,
  isTargetReward,
  isReviewing,
  loadReward,
  onRedeem,
  onBack,
  onRemoveTargetRewardClick,
  trackDisabledBuyNowClick,
  onTargetThisRewardClick,
  ...rest
}) => {
  useEffect(() => {
    loadReward?.(rewardId)
  }, [loadReward, rewardId])

  const locationHref = window.location.href
  const { name, heroImage, coverImage } = reward || {}

  const ogMetaTags = {
    site_name: 'Salad',
    url: locationHref,
    title: `Get ${name} with the power of your PC with Salad`,
    description: `Salad helps you earn your way to rewards like ${name}, Steam Games, Discord Nitro, and more from the Salad Storefront. You can even send Salad Balance to PayPal and redeem digital Visa and Mastercard that can be used worldwide!`,
    image: heroImage ?? coverImage ?? '',
    'image:alt': name ?? '',
  }
  useOgMetaTags(ogMetaTags)

  return (
    <div className={classes.container}>
      {isReviewing && <ReviewAfterRedemptionContainer />}
      <Helmet>
        <title>My Title</title>
        <meta
          property="og:url"
          content="http://www.nytimes.com/2015/02/19/arts/international/when-great-minds-dont-think-alike.html"
        />
      </Helmet>
      <Head title={reward?.name} />
      <RewardHeaderBar
        reward={reward}
        onBack={onBack}
        onRedeem={onRedeem}
        requiresMinecraftUsername={requiresMinecraftUsername}
        requiresPayPalAccount={requiresPayPalAccount}
        requiresSaladCard={requiresSaladCard}
        isTargetReward={isTargetReward}
        onTargetThisRewardClick={onTargetThisRewardClick}
        onRemoveTargetRewardClick={onRemoveTargetRewardClick}
        trackDisabledBuyNowClick={trackDisabledBuyNowClick}
        {...rest}
      />
      <Scrollbar>
        <div className={classes.scrollContent}>
          <RewardImageCarousel reward={reward} />
          <RewardInfoPanel reward={reward} />
          <RewardHowToPanel reward={reward} {...rest} />
          <RewardDescriptionPanel reward={reward} />
          <RewardRequirementsPanel reward={reward} />
          <RewardDisclaimers />
        </div>
      </Scrollbar>
    </div>
  )
}

export const RewardDetailsPage = withStyles(styles)(_RewardDetailsPage)
