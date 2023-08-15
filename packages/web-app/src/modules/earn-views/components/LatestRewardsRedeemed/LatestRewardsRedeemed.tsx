import { Button } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { SectionHeader } from '../../../../components'
import type { SaladTheme } from '../../../../SaladTheme'
import type { RedeemedReward } from '../../../balance/models/RedeemedReward'
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
}

const _LatestRewardsRedeemed: FunctionComponent<Props> = ({
  classes,
  latestCompletedRedeemedRewards,
  navigateToRewardVaultPage,
}) => {
  const isLatestCompletedRedeemedRewardsExist =
    latestCompletedRedeemedRewards && latestCompletedRedeemedRewards?.length > 0

  return (
    <div className={classes.container}>
      <SectionHeader>Latest Rewards Redeemed</SectionHeader>
      {isLatestCompletedRedeemedRewardsExist ? (
        <>
          <div className={classes.rewards}>
            {latestCompletedRedeemedRewards?.map((latestCompletedRedeemedReward) => (
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
    </div>
  )
}

export const LatestRewardsRedeemed = withStyles(styles)(_LatestRewardsRedeemed)
