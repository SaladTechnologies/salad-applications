import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import 'react-aspect-ratio/aspect-ratio.css'
//@ts-ignore
import AspectRatio from 'react-aspect-ratio'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { Reward } from '../../reward/models'
import { Button } from '../../../components'
import Img from 'react-image'
import { RewardMissingImage } from './RewardMissingImage'

const styles = (theme: SaladTheme) => ({
  container: {},
  content: {
    margin: '0 auto', //Centers the content
    maxWidth: 1400,
    position: 'relative',
    padding: '0 30px',
  },
  imageContainer: {
    width: '70%',
    cursor: 'pointer',
    overflow: 'hidden',
    '&:hover': {
      opacity: 0.8,
    },
  },
  image: {
    objectFit: 'cover',
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  infoContainer: {
    position: 'absolute',
    color: theme.lightGreen,
    top: '10%',
    width: '26%',
    height: '50%',
    minWidth: 300,
    minHeight: 180,
    right: 30,
    padding: '6px 24px',
    zIndex: 2,
    backdropFilter: 'blur(8.57952px)',
    background:
      'linear-gradient(104.2deg, rgba(41, 105, 45, 0.6) -28.93%, rgba(41, 105, 45, 0.48) 19.91%, rgba(83, 166, 38, 0.6) 49.73%, rgba(51, 130, 56, 0.6) 88.28%)',
    border: '1px solid rgba(219, 241, 193, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    textShadow: '0px 0px 5px rgba(178, 213, 48, 0.5), -1px -1px 3px rgba(0, 0, 0, 0.25)',
  },
  nameText: {
    fontFamily: theme.fontGroteskLight09,
    fontSize: 48,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  priceContainer: {
    display: 'flex',
  },
  priceText: {
    color: theme.green,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 12,
  },
  outOfStockPrice: {
    textDecoration: 'line-through',
    color: theme.red,
  },
  stockLabel: {
    marginLeft: 8,
    padding: '1px 10px',
    fontSize: 8,
    display: 'flex',
    alignItems: 'center',
    textShadow: '',
  },
  outOfStockLabel: {
    color: theme.lightGreen,
    backgroundColor: theme.red,
  },
  lowQuanityLabel: {
    color: theme.darkBlue,
    backgroundColor: theme.green,
  },
  headlineText: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 14,
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
}

class _RewardHeroItem extends Component<Props> {
  handleViewReward = () => {
    const { onViewReward, reward } = this.props

    if (onViewReward && reward) {
      onViewReward(reward)
    }
  }

  render() {
    const { reward, classes } = this.props

    let outOfStock = reward?.quantity === 0
    let lowQuanity = reward?.quantity !== undefined && reward?.quantity > 0

    return (
      <div key={reward?.id} className={classnames(classes.container)}>
        <div className={classes.content}>
          <div className={classes.imageContainer} onClick={this.handleViewReward}>
            <AspectRatio ratio={'800/450'}>
              <Img
                className={classes.image}
                src={reward?.heroImage}
                draggable={false}
                alt=""
                unloader={<RewardMissingImage text={reward?.name} />}
              />
            </AspectRatio>
          </div>
          {reward && (
            <div className={classes.infoContainer}>
              <div className={classes.nameText}>{reward?.name}</div>
              <div className={classes.priceContainer}>
                <div className={classnames(classes.priceText, { [classes.outOfStockPrice]: outOfStock })}>
                  ${reward?.price.toFixed(2)}
                </div>
                {outOfStock && (
                  <div className={classnames(classes.priceText, classes.stockLabel, classes.outOfStockLabel)}>
                    Out of Stock
                  </div>
                )}
                {lowQuanity && (
                  <div className={classnames(classes.priceText, classes.stockLabel, classes.lowQuanityLabel)}>
                    {`${reward?.quantity} Remaining`}
                  </div>
                )}
              </div>
              <div className={classes.headlineText}>{reward?.headline}</div>
              <div className={classes.buttonContainer}>
                <Button onClick={this.handleViewReward} disabled={reward === undefined}>
                  GET IT NOW
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export const RewardHeroItem = withStyles(styles)(_RewardHeroItem)
