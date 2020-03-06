import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import { RewardDisclaimers } from '../components'
import { Scrollbars } from 'react-custom-scrollbars'
import { P } from '../../../components'
import { RewardItem } from '../components/RewardItem'
import { rewardItemResponsive } from '../components/RewardSlider'

const styles = (theme: SaladTheme) => {
  let style = {
    container: {
      padding: 20,
      color: theme.lightGreen,
      display: 'flex',
      flexDirection: 'column',
    },
    titleText: {
      fontFamily: theme.fontGroteskBook19,
      fontSize: 20,
      padding: '12px 18px',
      textTransform: 'capitalize',
    },
    placeholderText: {
      paddingLeft: 20,
    },
    rewardContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    rewardRow: {
      backgroundColor: 'blue',
    },
    rewardItem: {
      flex: '0 0 25%',
      paddingBottom: 30,
      width: 0, //This is magic and somehow makes the flex work
    },
  }

  let a = style as any

  for (let value of Object.values(rewardItemResponsive)) {
    a[`@media screen and (max-width:${value.breakpoint.max}px)`] = {
      rewardItem: { flex: `0 0 ${(1 / value.items) * 100}%` },
    }
  }

  return style
}

interface Props extends WithStyles<typeof styles> {
  title?: string
  rewards?: Reward[]
  onViewReward?: (reward?: Reward) => void
}

class _BrowseRewardsPage extends Component<Props> {
  render() {
    const { rewards, title, onViewReward, classes } = this.props
    const hasRewards = rewards && rewards.length > 0

    return (
      <Scrollbars>
        <div className={classes.container}>
          {title && <div className={classes.titleText}>{title}</div>}
          {!hasRewards && <P className={classes.placeholderText}>No Rewards Found</P>}
          {hasRewards && (
            <div>
              <div className={classes.rewardContainer}>
                {rewards?.map(x => (
                  <div className={classes.rewardItem}>
                    <RewardItem reward={x} onViewReward={onViewReward} />
                  </div>
                ))}
              </div>
              <RewardDisclaimers />
            </div>
          )}
        </div>
      </Scrollbars>
    )
  }
}

export const BrowseRewardsPage = withStyles(styles)(_BrowseRewardsPage)
