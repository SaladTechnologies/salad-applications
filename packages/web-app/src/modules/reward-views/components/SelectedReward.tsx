import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { AngledPanel, AngleDirection } from '../../../components/AngledPanel'
import { Reward } from '../../reward/models/Reward'
import { ProgressBar } from '../../../components/ProgressBar'

const styles = (theme: SaladTheme) => ({
  container: {
    width: '790px',
  },
  choppingTitle: {
    fontFamily: 'sharpGroteskBook25',
    color: theme.mediumGreen,
    textTransform: 'uppercase',
    paddingLeft: '12.5rem',
    paddingBottom: '.25rem',
  },
  cardContainer: {
    height: '9rem',
    display: 'flex',
    position: 'relative',
  },
  lock: {
    position: 'absolute',
    right: '.5rem',
    top: '.5rem',
  },
  imageContainer: {
    display: 'inline-block',
    backgroundColor: theme.offWhite,
    width: '190px',
  },
  image: {
    height: '100%',
    width: 'auto',
  },
  rightContainer: {
    width: '37rem',
    padding: '.5rem',
    overflow: 'hidden',
    marginLeft: '.5rem',
    display: 'inline-block',
  },
  redeemable: {
    backgroundColor: theme.lightGreen,
    color: theme.blueFont,
  },
  notRedeemable: {
    backgroundColor: theme.darkGreen,
    color: theme.lightGreen,
  },
  nameText: {
    fontSize: theme.xxLarge,
    fontFamily: 'SharpGroteskLight09',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: '-.5rem',
  },
  priceText: {
    fontSize: theme.medium,
    fontFamily: 'SharpGroteskLight25',
    whiteSpace: 'pre',
  },
  progressContainer: {
    padding: '.5rem 0',
  },
  progressBackground: {
    borderRadius: 0,
    backgroundColor: theme.darkGreen,
    height: '0.5rem',
  },
  progressBar: {
    backgroundColor: theme.lightGreen,
    boxShadow: `0px 0px 10px 0px ${theme.lightGreen}`,
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
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

  render() {
    const { reward, classes } = this.props

    let redeemable = reward && reward.redeemable

    return (
      <div className={classes.container}>
        <div className={classes.choppingTitle}>Chopping Salad For:</div>
        <div className={classnames(classes.cardContainer, 'is-unselectable')}>
          {/* Image */}
          <AngledPanel className={classes.imageContainer} leftSide={AngleDirection.Right}>
            {reward && <img className={classes.image} src={reward.imageSrc} />}
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
              {reward && `${reward.price.toFixed(2)} ${this.timeRemainingText()}`}
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
