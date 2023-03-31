import { Button } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Scrollbar } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import { DefaultTheme } from '../../../SaladTheme'
import type { Reward } from '../../reward/models'
import { RewardCard } from '../components/RewardCard'
import FortniteImageURL from './assets/fortnite.png'
import NorthAmerica5URL from './assets/northAmerica5.png'
import SaladBackgroundURL from './assets/saladBackground.png'
import Xbox10ImageURL from './assets/xbox10.png'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    height: '100%',
  },
  rewardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    margin: '70px 45px 0px 330px',
  },
  targetRewards: {
    display: 'flex',
    gap: '32px',
    alignItems: 'stretch',
    maxWidth: 655,
    flexWrap: 'wrap',
  },
  header: {
    margin: 0,
    fontFamily: 'sharpGroteskLight09',
    color: theme.green,
    fontSize: '96px',
    fontWeight: 300,
    textShadow: '0px 0px 24px rgba(178, 213, 48, 0.7)',
  },
  description: {
    fontFamily: 'Mallory',
    color: theme.lightGreen,
    fontSize: '16px',
    lineHeight: '24px',
  },
  backgroundImage: {
    backgroundImage: `url(${SaladBackgroundURL})`,
    backgroundSize: 'cover',
    width: '75%',
  },
  buttonContainer: {
    marginBottom: '5px',
  },
})

interface Props extends WithStyles<typeof styles> {
  rewards: Reward[]
  onConfirmTargetReward: (reward: Reward) => void
}

const _SelectTargetRewardPage: FunctionComponent<Props> = ({ classes, rewards, onConfirmTargetReward }) => {
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null)
  const [visibleRewards, setVisibleRewards] = useState(6)

  const selectTargetReward = (rewardId: string) => {
    setSelectedRewardId(rewardId)
  }

  const confirmTargetReward = (reward: Reward) => {
    // * TODO: Add redirect to the "You've selected ..." new page
    onConfirmTargetReward(reward)
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
      {
        id: '658d2a5c-4049-4883-bb48-7e3b9d2708a2',
        name: 'Second Original price test',
        price: 8.90,
        tags: [],
        coverImage: FortniteImageURL,
      },
      {
        id: 'cd7f8e4b-a345-41ca-8e8a-8eff9840cdea',
        name: 'Sarah Manual Reward test 11',
        price: 4.0,
        tags: [],
        coverImage: Xbox10ImageURL,
      },
      {
        id: '332574d4-bdaa-4c0f-ab0a-d992fd022ccc',
        name: 'Discord Nitro',
        price: 9.99,
        tags: [],
        coverImage: NorthAmerica5URL,
      },
      {
        id: '1d78685e-e475-4c30-900b-9cdadc47f8b4',
        name: 'Salad For Your Home PC Short-Sleeve T-Shirt - Black & Athletic Heather',
        price: 100.01,
        tags: [],
        coverImage: NorthAmerica5URL,
      },
    ] ?? rewards

  return (
    <Scrollbar>
      <div className={classes.container}>
        <div className={classes.rewardsContainer}>
          <div>
            <h1 className={classes.header}>Select a Reward to Target</h1>
            <p className={classes.description}>
              You can target any of these rewards, or any other reward in the Salad store, and track your progress
              towards redeeming it. Once you have enough balance you can get that sweet loot or get something else
            </p>
          </div>
          {/* * NOTE: Should be replaced with "targetRewards" from props when backend is ready */}
          <div className={classes.targetRewards}>
            {mockedRewards.slice(0, visibleRewards).map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                isSelected={selectedRewardId === reward.id}
                onSelectReward={selectTargetReward}
                onConfirmReward={confirmTargetReward}
              />
            ))}
            {visibleRewards < mockedRewards.length && (
              <div className={classes.buttonContainer}>
                <Button
                  variant="outlined"
                  outlineColor={DefaultTheme.lightGreen}
                  onClick={() => setVisibleRewards(visibleRewards + 3)}
                  label="View More Items"
                />
              </div>
            )}
          </div>
        </div>
        <div className={classes.backgroundImage}></div>
      </div>
    </Scrollbar>
  )
}

export const SelectTargetRewardPage = withStyles(styles)(_SelectTargetRewardPage)
