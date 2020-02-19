import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import Img from 'react-image'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { Reward } from '../../reward/models'
import logo from './assets/default-image.png'

const styles = (theme: SaladTheme) => ({
  container: {
    userSelect: 'none',
    position: 'relative',
    flexShrink: 0,
    margin: '0 6px',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 500,
  },
  image: {
    height: 'auto',
    width: '100%',
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.10)',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
  missingImageContainer: {
    position: 'relative',
    backgroundColor: theme.green,
    zIndex: -1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingImageText: {
    position: 'absolute',
    color: theme.darkBlue,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 48,
    textAlign: 'center',
  },
  textContainer: {
    padding: '0 10px',
  },
  nameText: {
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 24,
    letterSpacing: 0.5,
    flex: 1,
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
  reward?: Reward
  onClick?: () => void
}

class _RewardItem extends Component<Props> {
  render() {
    const { reward, classes } = this.props
    return (
      <div key={reward?.id} className={classnames(classes.container)}>
        <Img
          className={classes.image}
          src={reward?.coverImage}
          draggable={false}
          alt=""
          unloader={
            <div className={classes.missingImageContainer}>
              <Img className={classes.image} src={logo} alt="" />
              <div className={classes.missingImageText}>{reward?.name}</div>
            </div>
          }
        />
        <div className={classes.textContainer}>
          <div className={classes.nameText}>{reward ? reward.name : 'Unknown'}</div>
          <div className={classes.priceText}>${reward ? reward.price.toFixed(2) : '-'}</div>
        </div>
      </div>
    )
  }
}

export const RewardItem = withStyles(styles)(_RewardItem)
