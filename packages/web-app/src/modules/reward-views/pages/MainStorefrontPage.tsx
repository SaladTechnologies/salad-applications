import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import { RewardSlider, RewardDisclaimers, RewardHero } from '../components'
import { RewardItem } from '../components/RewardItem'
import { Scrollbars } from 'react-custom-scrollbars'
import { RewardHeroItem } from '../components/RewardHeroItem'

const styles = (theme: SaladTheme) => ({
  container: {},
  content: {
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'column',
  },
})

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
      <Scrollbars>
        <div className={classes.content}>
          {categories && categories.size > 0 ? (
            Array.from(categories).map(([category, rewards]) => {
              if (!rewards || rewards.length === 0) {
                return null
              } else if (heroCategories.includes(category)) {
                return (
                  <RewardHero title={category}>
                    {rewards.map(x => (
                      <RewardHeroItem reward={x} onViewReward={onViewReward} />
                    ))}
                  </RewardHero>
                )
              } else {
                return (
                  <RewardSlider title={category} onViewMore={onViewMore}>
                    {rewards.slice(0, maxRowSize).map(x => (
                      <RewardItem reward={x} onViewReward={onViewReward} />
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
              {[...Array(3)].map(() => (
                <RewardSlider title={'Games'}>
                  {[...Array(maxRowSize / 2)].map(() => (
                    <RewardItem />
                  ))}
                </RewardSlider>
              ))}
            </div>
          )}
          <RewardDisclaimers />
        </div>
      </Scrollbars>
    )
  }
}

export const MainStorefrontPage = withStyles(styles)(_MainStorefrontPage)
