import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models/Reward'
import { RewardSummary } from './RewardSummary'
import { Fade, Scrollbar } from '../../../components'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  container: {
    width: '24rem',
    marginLeft: '26px',
    display: 'inline-block',
    position: 'relative',
    userSelect: 'none',
  },
  topFade: {
    height: '3rem',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  item: {
    padding: '.25rem 0',
  },
  scrollThumb: {
    backgroundColor: theme.lightGreen,
    cursor: 'pointer',
  },
  scrollTrack: {
    margin: '.25rem',
    right: 0,
    bottom: 0,
    top: 0,
    width: '.5rem !important',
    padding: '-5px',
    background: `linear-gradient(to right, 
      transparent 0%, 
      transparent calc(50% - 0.81px), 
      ${theme.lightGreen} calc(50% - 0.8px), 
      ${theme.lightGreen} calc(50% + 0.8px), 
      transparent calc(50% + 0.81px), 
      transparent 100%)`,
  },
  disclaimer: {
    color: theme.green,
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
    padding: '.25rem 1.5rem 3rem 0',
  },
  notFoundTitle: {
    color: theme.green,
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xLarge,
    padding: '3rem 0',
  },
})

interface Props extends WithStyles<typeof styles> {
  rewards?: Reward[]
  onRewardClick?: (reward: Reward) => void
  isLoading?: boolean
}

class _RewardList extends Component<Props> {
  handleClick = (reward: Reward) => {
    const { onRewardClick } = this.props

    if (onRewardClick) {
      onRewardClick(reward)
    }
  }

  render() {
    const { rewards, classes, isLoading } = this.props

    return (
      <div className={classnames(classes.container)}>
        <Fade className={classes.topFade} direction="down" />
        <Scrollbar scrollBottom={30} scrollTop={32}>
          <div style={{ height: '2rem' }} />
          {isLoading && <div className={classes.notFoundTitle}>Loading Rewards</div>}
          {rewards && rewards.length === 0 && <div className={classes.notFoundTitle}>No Rewards Found...</div>}
          {rewards &&
            rewards.map((r, _) => (
              <div key={r.id} className={classes.item}>
                <RewardSummary
                  name={r.name}
                  price={r.price}
                  redeemable={r.redeemable}
                  imageSrc={r.imageSrc}
                  onClick={() => {
                    this.handleClick(r)
                  }}
                  timeRemaining={r.remainingTimeLabel}
                  color={r.color}
                />
              </div>
            ))}
          <div className={classes.disclaimer}>
            [SUPPLIER DISCLAIMER] The merchants represented are not sponsors of the rewards or otherwise affiliated with
            Salad Technologies, Inc. The logos and other identifying marks attached are trademarks of, and owned by,
            each represented company and/or its affiliates. Please visit each company's website for additional terms and
            conditions.
          </div>
          <div style={{ height: '3rem' }} />
        </Scrollbar>
      </div>
    )
  }
}

export const RewardList = withStyles(styles)(_RewardList)
