import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import { RewardDisclaimers } from '../components'
import { Scrollbars } from 'react-custom-scrollbars'
import { P } from '../../../components'
import { RewardItem } from '../components/RewardItem'
import { rewardItemResponsive } from '../components/RewardSlider'
import { IconArrowLeft } from '../components/assets'

const styles = (theme: SaladTheme) => {
  let style = {
    container: {
      position: 'absolute',
      color: theme.lightGreen,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    contentContainer: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
    },
    titleBar: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px 0px',
    },
    backButton: {
      width: 15,
      padding: 10,
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.5,
      },
    },
    titleText: {
      fontFamily: theme.fontGroteskBook19,
      fontSize: 24,
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
      rewardItem: { flex: `0 0 ${(1 / (value.items + 2)) * 100}%` },
    }
  }

  return style
}

interface Props extends WithStyles<typeof styles> {
  title?: string
  rewards?: Reward[]
  onViewReward?: (reward?: Reward) => void
  onBack?: () => void
}

class _BrowseRewardsPage extends Component<Props> {
  handleBack = () => {
    const { onBack } = this.props

    onBack?.()
  }
  render() {
    const { rewards, title, onViewReward, classes } = this.props
    const hasRewards = rewards && rewards.length > 0

    return (
      <div className={classes.container}>
        <div className={classes.titleBar}>
          <div className={classes.backButton} onClick={this.handleBack}>
            <IconArrowLeft />
          </div>
          <div className={classes.titleText}>{title || 'Back'}</div>
        </div>
        <Scrollbars>
          <div className={classes.contentContainer}>
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
      </div>
    )
  }
}

export const BrowseRewardsPage = withStyles(styles)(_BrowseRewardsPage)
