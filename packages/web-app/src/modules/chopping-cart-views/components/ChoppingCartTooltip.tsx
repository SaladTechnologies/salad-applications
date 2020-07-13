import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import { P, SmartLink } from '../../../components'
import Img from 'react-image'
import { rewardRoute } from '../../../RouteUtils'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.lightGreen,
    backgroundColor: theme.darkBlue,
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    zIndex: 99999,
    border: '1px solid black',
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    width: 450,
    overflow: 'hidden',
  },
  title: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  rewardItem: {
    height: 100,
    padding: 5,
    display: 'flex',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
  rewardImage: {
    height: '100%',
    width: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  missingRewardImage: {
    height: '100%',
    width: 75,
    backgroundColor: theme.lightGreen,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  nameText: {
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 24,
    letterSpacing: 0.5,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  priceText: {
    color: theme.green,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    letterSpacing: 1,
  },
})

interface Props extends WithStyles<typeof styles> {
  rewards?: Reward[]
}

class _ChoppingCartTooltip extends Component<Props> {
  render() {
    const { rewards, classes } = this.props

    const hasRewards = rewards !== undefined && rewards.length !== 0

    return (
      <div className={classes.container}>
        <div className={classes.title}>Chopping Cart</div>
        {!hasRewards && <P>Your Chopping Cart is Empty</P>}
        {hasRewards &&
          rewards?.map((x) => (
            <SmartLink to={rewardRoute(x)}>
              <div className={classes.rewardItem}>
                <Img
                  className={classes.rewardImage}
                  src={x.coverImage}
                  draggable={false}
                  alt=""
                  unloader={<div className={classes.missingRewardImage}></div>}
                />
                <div className={classes.textContainer}>
                  <div className={classes.nameText}>{x.name}</div>
                  <div className={classes.priceText}>${x.price.toFixed(2)}</div>
                </div>
              </div>
            </SmartLink>
          ))}
      </div>
    )
  }
}

export const ChoppingCartTooltip = withStyles(styles)(_ChoppingCartTooltip)
