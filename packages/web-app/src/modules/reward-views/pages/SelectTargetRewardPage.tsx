import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Scrollbar } from '../../../components'
import type { Reward } from '../../reward/models'
import { TargetRewardItem } from '../components/TargetRewardItem'
import FortniteImageURL from './assets/fortnite.png'
import NorthAmerica5URL from './assets/northAmerica5.png'
import Xbox10ImageURL from './assets/xbox10.png'

const styles = () => ({
  targetRewards: {
    display: 'flex',
    margin: '5rem 1rem 0',
    gap: '32px',
    alignItems: 'stretch',
    maxWidth: 655,
    flexWrap: 'wrap',
  },
})

interface Props extends WithStyles<typeof styles> {
  targetRewards: Reward[]
  onSelectTargetReward: (reward: Reward) => void
}

interface State {
  selectedTargetRewardId: string | null
}

class _SelectTargetRewardPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedTargetRewardId: null,
    }
  }

  onSelectTargetRewardClick = (rewardId: string) => {
    this.setState({ selectedTargetRewardId: rewardId })
  }

  onConfirmTargetRewardSelectionClick = (targetReward: Reward) => {
    // * TODO: Add redirect to the "You've selected ..." new page
    this.props.onSelectTargetReward(targetReward)
  }

  public override render(): ReactNode {
    const { classes } = this.props

    const mockedTargetRewards = [
      {
        id: 'd214ac17-daaf-4e14-87ac-036f93f32474',
        name: 'Discord Nitro',
        price: 10.0,
        tags: [],
        coverImage: FortniteImageURL,
      },
      {
        id: 'ec83ab9f-22f0-4de5-ab33-7af39289da2c',
        name: 'Fortnite Harley Quinn Back Bling DLC Some DL',
        price: 20.0,
        tags: [],
        coverImage: Xbox10ImageURL,
      },
      {
        id: '6c6d069b-5f57-4429-b7c4-4f4f174eef31',
        name: 'Valorant - $5 Gift Card [NA]',
        price: 5.0,
        tags: [],
        coverImage: NorthAmerica5URL,
      },
    ]

    return (
      <Scrollbar>
        <div className={classes.targetRewards}>
          {/* * NOTE: Should be replaced with "targetRewards" from props when backend is ready */}
          {mockedTargetRewards.map((targetReward) => (
            <TargetRewardItem
              key={targetReward.id}
              isSelected={this.state.selectedTargetRewardId === targetReward.id}
              targetReward={targetReward}
              onSelectTargetRewardClick={this.onSelectTargetRewardClick}
              onConfirmTargetRewardSelectionClick={this.onConfirmTargetRewardSelectionClick}
            />
          ))}
        </div>
      </Scrollbar>
    )
  }
}

export const SelectTargetRewardPage = withStyles(styles)(_SelectTargetRewardPage)
