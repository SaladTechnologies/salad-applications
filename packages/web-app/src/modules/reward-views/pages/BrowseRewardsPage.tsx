import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import { RewardDisclaimers } from '../components'
import { Scrollbars } from 'react-custom-scrollbars'
import { P, Scrollbar } from '../../../components'
import { RewardItem } from '../components/RewardItem'
import { rewardItemResponsive } from '../components/RewardSlider'
import { IconArrowLeft } from '../components/assets'
import { RewardFilterContainer } from '../RewardFilterContainer'
import { RouteComponentProps } from 'react-router'

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
    columnContainer: {
      display: 'flex',
      flex: 1,
    },
    contentContainer: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    filterContainer: {
      flex: 1,
      padding: 20,
    },
    titleBar: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px 0px',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.5,
      },
    },
    backButton: {
      width: 15,
      padding: 10,
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
      rewardItem: { flex: `0 0 ${(1 / value.items) * 100}%` },
    }
  }

  return style
}

interface Props extends WithStyles<typeof styles> {
  title?: string
  rewards?: Reward[]
  onViewReward?: (reward?: Reward) => void
  onBack?: () => void
  route?: RouteComponentProps<{ category: string }>
}

class _BrowseRewardsPage extends Component<Props> {
  handleBack = () => {
    const { onBack } = this.props

    onBack?.()
  }
  render() {
    const { rewards, title, onViewReward, route, classes } = this.props
    const hasRewards = rewards && rewards.length > 0

    return (
      <div className={classes.container}>
        <div className={classes.titleBar} onClick={this.handleBack}>
          <div className={classes.backButton}>
            <IconArrowLeft />
          </div>
          <div className={classes.titleText}>{title || 'Back'}</div>
        </div>
        <div className={classes.columnContainer}>
          <div style={{ flex: 1 }}>
            <Scrollbar>
              <div className={classes.contentContainer}>
                {!hasRewards && <P className={classes.placeholderText}>No Rewards Found</P>}
                {hasRewards && (
                  <div>
                    <div className={classes.rewardContainer}>
                      {rewards?.map((x) => (
                        <div key={x.id} className={classes.rewardItem}>
                          <RewardItem reward={x} onViewReward={onViewReward} />
                        </div>
                      ))}
                    </div>
                    <RewardDisclaimers />
                  </div>
                )}
              </div>
            </Scrollbar>
          </div>
          <div style={{ flex: '0 0 250px' }}>
            <Scrollbars>
              <div className={classes.filterContainer}>
                <RewardFilterContainer route={route} />
              </div>
            </Scrollbars>
          </div>
        </div>
      </div>
    )
  }
}

export const BrowseRewardsPage = withStyles(styles)(_BrowseRewardsPage)
