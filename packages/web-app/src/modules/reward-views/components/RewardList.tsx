import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models/Reward'
import Scrollbars from 'react-custom-scrollbars'
import { RewardListItem } from './RewardListItem'
import { Fade } from '../../../components/Fade'

const styles = (theme: SaladTheme) => ({
  container: {
    width: '32rem',
    height: '100%',
    display: 'inline-block',
    marginLeft: '3.5rem',
    position: 'relative',
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
    backgroundColor: theme.offWhite,
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
      ${theme.offWhite} calc(50% - 0.8px), 
      ${theme.offWhite} calc(50% + 0.8px), 
      transparent calc(50% + 0.81px), 
      transparent 100%)`,
  },
})

interface Props extends WithStyles<typeof styles> {
  rewards?: Reward[]
  onRewardClick?: (reward: Reward) => void
}

class _RewardList extends Component<Props> {
  handleClick = (reward: Reward) => {
    const { onRewardClick } = this.props

    if (onRewardClick) {
      onRewardClick(reward)
    }
  }

  render() {
    const { rewards, classes } = this.props

    const renderTrack = (props: any) => <div {...props} className={classes.scrollTrack} />
    const renderThumb = (props: any) => <div {...props} className={classes.scrollThumb} />

    return (
      <div className={classes.container}>
        <Fade className={classes.topFade} direction="down" />
        <Scrollbars
          renderTrackHorizontal={renderTrack}
          renderTrackVertical={renderTrack}
          renderThumbHorizontal={renderThumb}
          renderThumbVertical={renderThumb}
        >
          {rewards &&
            rewards.map((r, _) => (
              <div key={r.id} className={classes.item}>
                <RewardListItem
                  reward={r}
                  onClick={() => {
                    this.handleClick(r)
                  }}
                />
              </div>
            ))}
        </Scrollbars>
      </div>
    )
  }
}

export const RewardList = withStyles(styles)(_RewardList)
