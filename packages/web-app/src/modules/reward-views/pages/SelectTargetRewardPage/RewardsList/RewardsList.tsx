import { Button } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { DefaultTheme } from '../../../../../SaladTheme'
import type { Reward } from '../../../../reward/models'
import { RewardCard } from './RewardCard'

export const styles = {
  rewards: {
    display: 'flex',
    gap: '32px',
    alignItems: 'stretch',
    maxWidth: 655,
    flexWrap: 'wrap',
    paddingBottom: '100px',
  },
  buttonContainer: {
    marginBottom: '5px',
  },
}

interface Props extends WithStyles<typeof styles> {
  rewards: Reward[]
  onConfirmTargetReward: (reward: Reward) => void
}

const _RewardsList: FunctionComponent<Props> = ({ classes, rewards, onConfirmTargetReward }) => {
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null)
  const [visibleRewardsAmount, setVisibleRewardsAmount] = useState(6)

  const selectTargetReward = (rewardId: string) => {
    setSelectedRewardId(rewardId)
  }

  return (
    <div className={classes.rewards}>
      {rewards.slice(0, visibleRewardsAmount).map((reward) => (
        <RewardCard
          key={reward.id}
          reward={reward}
          isSelected={selectedRewardId === reward.id}
          onSelectReward={selectTargetReward}
          onConfirmReward={onConfirmTargetReward}
        />
      ))}
      {visibleRewardsAmount < rewards.length && (
        <div className={classes.buttonContainer}>
          <Button
            variant="outlined"
            outlineColor={DefaultTheme.lightGreen}
            onClick={() => setVisibleRewardsAmount(visibleRewardsAmount + 3)}
            label="View More Items"
          />
        </div>
      )}
    </div>
  )
}

export const RewardsList = withStyles(styles)(_RewardsList)
