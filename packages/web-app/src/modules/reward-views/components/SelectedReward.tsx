import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { AngledPanel } from '../../../components'
import { Reward } from '../../reward/models/Reward'
import { ProgressBar } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    // width: '551px',
    userSelect: 'none',
    display: 'inline-block',
  },
  choppingTitle: {
    fontFamily: 'sharpGroteskBook25',
    color: theme.mediumGreen,
    textTransform: 'uppercase',
    paddingLeft: '145px',
    paddingBottom: '.25rem',
    letterSpacing: '1px',
    fontSize: '10px',
  },
  cardContainer: {
    display: 'flex',
    height: '100px',
    position: 'relative',
    justifyContent: 'flex-start',
    cursor: 'pointer',
  },
  lock: {
    position: 'absolute',
    right: '.5rem',
    top: '.5rem',
  },
  imageContainer: {
    display: 'inline-block',
    width: '135.56px',
    backgroundColor: (props: Props) => (props.reward && props.reward.color) || 'transparent',
  },
  image: {
    height: '100%',
    width: 'auto',
  },
  rightContainer: {
    width: '410px',
    padding: '.5rem',
    overflow: 'hidden',
    marginLeft: '.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  redeemable: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
  },
  notRedeemable: {
    backgroundColor: theme.darkGreen,
    color: theme.green,
  },
  nameText: {
    fontSize: '54px',
    fontFamily: 'SharpGroteskLight09',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingTop: '.5rem',
  },
  priceText: {
    fontSize: '10px',
    fontFamily: 'SharpGroteskLight25',
    whiteSpace: 'pre',
  },
  progressContainer: {
    padding: '.5rem 0',
  },
  progressBackground: {
    borderRadius: 0,
    backgroundColor: theme.darkGreen,
    height: '4px',
  },
  progressBar: {
    backgroundColor: theme.green,
    boxShadow: `0px 0px 10px 0px ${theme.green}`,
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  onRewardClick?: (reward: Reward) => void
}

class _SelectedReward extends Component<Props> {
  timeRemainingText() {
    const { reward } = this.props

    if (reward === undefined) {
      return ''
    }

    if (reward.redeemable) {
      return '  |  Redeemable'
    }

    if (reward.remainingTimeLabel) {
      return `  |  ${reward.remainingTimeLabel}`
    }

    return ' '
  }

  handleClick = () => {
    const { onRewardClick, reward } = this.props

    if (onRewardClick && reward) {
      onRewardClick(reward)
    }
  }

  render() {
    const { reward, classes } = this.props

    let redeemable = reward && reward.redeemable

    return (
      <div className={classnames(classes.container)}>
        <div className={classes.choppingTitle}>Chopping Salad For:</div>
        <div className={classes.cardContainer} onClick={this.handleClick}>
          {/* Image */}
          <AngledPanel className={classes.imageContainer} leftSide={'right'}>
            {reward && <img className={classes.image} src={reward.image} draggable={false} />}
          </AngledPanel>

          {/* Right side panel */}
          <div
            className={classnames(classes.rightContainer, {
              [classes.redeemable]: redeemable,
              [classes.notRedeemable]: !redeemable,
            })}
          >
            {/* Padlock */}
            <div className={classes.lock}>
              {redeemable && <FontAwesomeIcon icon={faLockOpen} />}
              {!redeemable && <FontAwesomeIcon icon={faLock} />}
            </div>

            <div className={classnames(classes.priceText)}>
              {reward && `$${reward.price.toFixed(2)} ${this.timeRemainingText()}`}
            </div>
            <div className={classnames(classes.nameText)}>{reward ? reward.name : 'Unavailable'}</div>
          </div>
        </div>
        <div className={classes.progressContainer}>
          <ProgressBar
            barClassName={classes.progressBar}
            className={classes.progressBackground}
            progress={reward && reward.percentUnlocked * 100}
          />
        </div>
      </div>
    )
  }
}

export const SelectedReward = withStyles(styles)(_SelectedReward)
