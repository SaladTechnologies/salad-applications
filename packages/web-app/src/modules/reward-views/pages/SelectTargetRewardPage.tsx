import type { FunctionComponent } from 'react'
import { useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Scrollbar } from '../../../components'
import type { Reward } from '../../reward/models'
import { RewardCard } from '../components/RewardCard'
import FortniteImageURL from './assets/fortnite.png'
import NorthAmerica5URL from './assets/northAmerica5.png'
import Xbox10ImageURL from './assets/xbox10.png'

const styles = {
  targetRewards: {
    display: 'flex',
    margin: '5rem 1rem 0',
    gap: '32px',
    alignItems: 'stretch',
    maxWidth: 655,
    flexWrap: 'wrap',
  },
}

interface Props extends WithStyles<typeof styles> {
  targetRewards: Reward[]
  onSelectTargetReward: (reward: Reward) => void
}

const _SelectTargetRewardPage: FunctionComponent<Props> = ({ classes, targetRewards, onSelectTargetReward }) => {
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null)

  const handleSelectTargetRewardClick = (rewardId: string) => {
    setSelectedRewardId(rewardId)
  }

  const handleConfirmTargetRewardSelectionClick = (targetReward: Reward) => {
    // * TODO: Add redirect to the "You've selected ..." new page
    onSelectTargetReward(targetReward)
  }

  const mockedRewards =
    [
      {
        id: 'd214ac17-daaf-4e14-87ac-036f93f32474',
        name: 'Fortnite Harley Quinn Back Bling DLC Some DL',
        price: 12.79,
        tags: [],
        coverImage: FortniteImageURL,
      },
      {
        id: 'ec83ab9f-22f0-4de5-ab33-7af39289da2c',
        name: 'Xbox Live - $5 Gift Card ',
        price: 9.99,
        tags: [],
        coverImage: Xbox10ImageURL,
      },
      {
        id: '6c6d069b-5f57-4429-b7c4-4f4f174eef31',
        name: 'Valorant - $5 Card',
        price: 5.0,
        tags: [],
        coverImage: NorthAmerica5URL,
      },
    ] ?? targetRewards

  return (
    <Scrollbar>
      <div className={classes.targetRewards}>
        {/* * NOTE: Should be replaced with "targetRewards" from props when backend is ready */}
        {mockedRewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            isSelected={selectedRewardId === reward.id}
            onSelectTargetRewardClick={handleSelectTargetRewardClick}
            onConfirmTargetRewardSelectionClick={handleConfirmTargetRewardSelectionClick}
          />
        ))}
      </div>
    </Scrollbar>
  )
}

export const SelectTargetRewardPage = withStyles(styles)(_SelectTargetRewardPage)
