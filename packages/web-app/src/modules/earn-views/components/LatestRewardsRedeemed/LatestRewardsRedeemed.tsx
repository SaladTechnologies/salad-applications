import { Button, LoadingSpinner } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import type { RedeemedReward } from '../../../balance/models/RedeemedReward'
import { EarnSectionHeader } from '../EarnSectionHeader'
import { LatestRewardsRedeemedCard } from './components'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  rewards: {
    display: 'flex',
    gap: '56px',
    alignItems: 'stretch',
    maxWidth: 888,
    flexWrap: 'wrap',
  },
  noRewardsDescription: {
    fontFamily: theme.fontGroteskBook19,
    color: theme.lightGreen,
    fontSize: '16px',
    lineHeight: '24px',
  },
})

interface Props extends WithStyles<typeof styles> {
  latestCompletedRedeemedRewards?: RedeemedReward[]
  navigateToRewardVaultPage: () => void
  isLatestCompletedRedeemedRewardsLoading: boolean
}

const _LatestRewardsRedeemed: FunctionComponent<Props> = ({
  classes,
  latestCompletedRedeemedRewards,
  navigateToRewardVaultPage,
  isLatestCompletedRedeemedRewardsLoading,
}) => {
  const isLatestCompletedRedeemedRewardsExist =
    latestCompletedRedeemedRewards && latestCompletedRedeemedRewards?.length > 0

  return (
    <div className={classes.container}>
      <EarnSectionHeader>Latest Rewards Redeemed</EarnSectionHeader>
      {isLatestCompletedRedeemedRewardsLoading ? (
        <LoadingSpinner variant="light" size={100} />
      ) : (
        <>
          {isLatestCompletedRedeemedRewardsExist ? (
            <>
              <div className={classes.rewards}>
                {latestCompletedRedeemedRewards.map((latestCompletedRedeemedReward) => (
                  <LatestRewardsRedeemedCard {...latestCompletedRedeemedReward} />
                ))}
              </div>
              <Button
                outlineColor="#DBF1C1"
                variant="outlined"
                label="View Rewards Vault"
                onClick={navigateToRewardVaultPage}
              />
            </>
          ) : (
            <p className={classes.noRewardsDescription}>
              No rewards redeemed yet. Check out your reward progress on the top right of this screen.
            </p>
          )}
        </>
      )}
    </div>
  )
}

export const LatestRewardsRedeemed = withStyles(styles)(_LatestRewardsRedeemed)
