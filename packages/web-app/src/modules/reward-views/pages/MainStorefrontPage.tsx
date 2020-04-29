import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Reward } from '../../reward/models'
import { RewardSlider, RewardDisclaimers, RewardHero } from '../components'
import { RewardItem } from '../components/RewardItem'
import { RewardHeroItem } from '../components/RewardHeroItem'
import { NotificationBannerContainer } from '../../home-views/NotificationBannerContainer'
import { Scrollbar } from '../../../components'

const styles = {
  container: {},
  content: {
    paddingTop: 5,
    display: 'flex',
    flexDirection: 'column',
  },
}

interface Props extends WithStyles<typeof styles> {
  categories?: Map<string, Reward[]>
  onViewReward?: (reward?: Reward) => void
  onViewMore?: (title?: string) => void
}

/** List of categories that should be displayed as heros, all others are regular rewards */
const heroCategories = ['top chops']

class _MainStorefrontPage extends Component<Props> {
  render() {
    const { categories, onViewReward, onViewMore, classes } = this.props
    //Maximum number of rewards to show in a single row
    const maxRowSize = 20

    return (
      <Scrollbar>
        <div className={classes.content}>
          <NotificationBannerContainer />
          {categories && categories.size > 0 ? (
            Array.from(categories).map(([category, rewards]) => {
              if (!rewards || rewards.length === 0) {
                return null
              } else if (heroCategories.includes(category)) {
                return (
                  <RewardHero key={category} title={category}>
                    {rewards.map((x) => (
                      <RewardHeroItem key={x.id} reward={x} onViewReward={onViewReward} />
                    ))}
                  </RewardHero>
                )
              } else {
                return (
                  <RewardSlider key={category} title={category} onViewMore={onViewMore}>
                    {rewards.slice(0, maxRowSize).map((x) => (
                      <RewardItem key={x.id} reward={x} onViewReward={onViewReward} />
                    ))}
                  </RewardSlider>
                )
              }
            })
          ) : (
            <div>
              <RewardHero title={'Top Chops'}>
                <RewardHeroItem />
              </RewardHero>
              {[...Array(3)].map((_v, i) => (
                <RewardSlider key={i} title={'Games'}>
                  {[...Array(maxRowSize / 2)].map((_v, i) => (
                    <RewardItem key={i} />
                  ))}
                </RewardSlider>
              ))}
            </div>
          )}
          <RewardDisclaimers />
        </div>
      </Scrollbar>
    )
  }
}

export const MainStorefrontPage = withStyles(styles)(_MainStorefrontPage)
