import { Component, Fragment } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Head, Scrollbar } from '../../../components'
import { rewardCategoryRoute } from '../../../RouteUtils'
import { HeroType } from '../../engagement/models/HeroType'
import { NotificationBannerContainer } from '../../home-views/NotificationBannerContainer'
import { SearchResult } from '../../reward/models'
import { RewardDisclaimers, RewardHero, RewardSlider } from '../components'
import { RewardHeroItem } from '../components/RewardHeroItem'
import { RewardItem } from '../components/RewardItem'
import { MiningHero, OfferwallHero, ReferralEntryHero } from '../heroes'

const styles = {
  container: {},
  content: {
    paddingTop: 5,
    display: 'flex',
    flexDirection: 'column',
  },
}

interface Props extends WithStyles<typeof styles> {
  categories?: Map<string, SearchResult[]>
  heroes?: Map<number, HeroType>
  onClickReward: (to: string, action?: Function) => void
}

/** List of categories that should be displayed as heros, all others are regular rewards */
const heroCategories = ['top chops']

class _MainStorefrontPage extends Component<Props> {
  getHero = (index: number) => {
    const { heroes } = this.props

    const type = heroes?.get(index + 1)

    switch (type) {
      case HeroType.Mining:
        return <MiningHero key={index} />
      case HeroType.Offerwall:
        return <OfferwallHero key={index} />
      case HeroType.ReferralEntry:
        return <ReferralEntryHero key={index} />

      default:
        return null
    }
  }

  render() {
    const { categories, onClickReward, classes } = this.props
    //Maximum number of rewards to show in a single row
    const maxRowSize = 20

    return (
      <>
        <Scrollbar>
          <Head title="Official Store" />
          <div className={classes.content}>
            <NotificationBannerContainer />
            {categories && categories.size > 0 ? (
              Array.from(categories).map(([category, rewards], i) => {
                if (!rewards || rewards.length < 5) {
                  // The minimum number of items to show on the store
                  return null
                } else if (heroCategories.includes(category)) {
                  return (
                    <RewardHero key={category} title={category}>
                      {rewards.map((x) => (
                        <RewardHeroItem key={x.id} result={x} />
                      ))}
                    </RewardHero>
                  )
                } else {
                  return (
                    <Fragment key={category}>
                      <RewardSlider key={category} title={category} viewAllRoute={rewardCategoryRoute(category)}>
                        {rewards.slice(0, maxRowSize).map((x) => (
                          <RewardItem key={x.id} reward={x} onClick={() => onClickReward(x.url)} />
                        ))}
                      </RewardSlider>
                      {this.getHero(i)}
                    </Fragment>
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
                    {[...Array(maxRowSize / 2)].map((_v, i) => {
                      return <RewardItem key={i} />
                    })}
                  </RewardSlider>
                ))}
              </div>
            )}
            <RewardDisclaimers />
          </div>
        </Scrollbar>
      </>
    )
  }
}

export const MainStorefrontPage = withStyles(styles)(_MainStorefrontPage)
