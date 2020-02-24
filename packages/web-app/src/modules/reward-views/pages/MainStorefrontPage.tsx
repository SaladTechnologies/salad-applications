import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import { RewardSlider, RewardDisclaimers } from '../components'
import { RewardItem } from '../components/RewardItem'
import { Scrollbars } from 'react-custom-scrollbars'

const styles = (theme: SaladTheme) => ({
  container: {},
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
})

interface Props extends WithStyles<typeof styles> {
  categories?: Map<string, Reward[]>
  onViewReward?: (reward?: Reward) => void
}

class _MainStorefrontPage extends Component<Props> {
  render() {
    const { categories, onViewReward, classes } = this.props

    return (
      <Scrollbars>
        <div className={classes.content}>
          {categories &&
            Array.from(categories).map(([category, rewards]) => (
              <RewardSlider title={category}>
                {rewards.map(x => (
                  <RewardItem reward={x} onViewReward={onViewReward} />
                ))}
              </RewardSlider>
            ))}
          <RewardDisclaimers />
        </div>
      </Scrollbars>
    )
  }
}

export const MainStorefrontPage = withStyles(styles)(_MainStorefrontPage)
