import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { Reward } from '../../reward/models'
import { Button } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    userSelect: 'none',
    position: 'relative',
    flexShrink: 0,
    margin: '0 2px',
  },
  imageContainer: {
    width: '70%',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
  image: {
    height: 'auto',
    width: '100%',
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  infoContainer: {
    position: 'absolute',
    color: theme.lightGreen,
    top: '10%',
    width: '30%',
    height: '60%',
    right: 0,
    padding: '6px 24px',
    zIndex: 2,
    backdropFilter: 'blur(8.57952px)',
    background:
      'linear-gradient(104.2deg, rgba(41, 105, 45, 0.6) -28.93%, rgba(41, 105, 45, 0.48) 19.91%, rgba(83, 166, 38, 0.6) 49.73%, rgba(51, 130, 56, 0.6) 88.28%)',
    border: '1px solid rgba(219, 241, 193, 0.25)',
    display: 'flex',
    flexDirection: 'column',
  },
  nameText: {
    fontFamily: theme.fontGroteskLight09,
    fontSize: 36,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  priceText: {
    color: theme.green,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
  },
  headlineText: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
    flex: 2,
    paddingTop: 8,
  },
  buttonContainer: {},
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  onViewReward?: (reward?: Reward) => void
  onSelect?: (reward?: Reward) => void
}

class _RewardHeroItem extends Component<Props> {
  handleViewReward = () => {
    const { onViewReward, reward } = this.props

    if (onViewReward) {
      onViewReward(reward)
    }
  }

  handleSelect = () => {
    const { onSelect, reward } = this.props

    if (onSelect) {
      onSelect(reward)
    }
  }

  render() {
    const { reward, classes } = this.props
    return (
      <div key={reward?.id} className={classnames(classes.container)}>
        <div className={classes.imageContainer} onClick={this.handleViewReward}>
          {reward?.image && <img className={classes.image} src={reward?.image} draggable={false} alt="" />}
        </div>
        <div className={classes.infoContainer}>
          <div className={classes.nameText}>{reward?.name}</div>
          <div className={classes.priceText}>${reward?.price.toFixed(2)}</div>
          <div className={classes.headlineText}>{reward?.headline}</div>
          <div className={classes.buttonContainer}>
            <Button onClick={this.handleSelect}>CHOP FOR IT</Button>
            <Button onClick={this.handleViewReward}>GET IT NOW</Button>
          </div>
        </div>
      </div>
    )
  }
}

export const RewardHeroItem = withStyles(styles)(_RewardHeroItem)
