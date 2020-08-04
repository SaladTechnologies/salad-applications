import classnames from 'classnames'
import React, { Component } from 'react'
//@ts-ignore
import AspectRatio from 'react-aspect-ratio'
import Img from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import { SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { SearchResult } from '../../reward/models'
import { RewardMissingImage } from './RewardMissingImage'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'relative',
    flexShrink: 0,
    margin: '0 6px',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 500,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
  image: {
    height: 'auto',
    width: '100%',
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.10)',
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
    padding: 10,
  },
  subTextContainer: {
    display: 'flex',
  },
  nameText: {
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 32,
    letterSpacing: 0.5,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  priceText: {
    color: theme.green,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 12,
    letterSpacing: 1,
    paddingTop: 5,
  },
  outOfStockPrice: {
    textDecoration: 'line-through',
    color: theme.red,
  },
  stockLabel: {
    marginLeft: 8,
    padding: '0px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 7,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  outOfStockLabel: {
    color: theme.lightGreen,
    backgroundColor: theme.red,
  },
  lowQuanityLabel: {
    color: theme.darkBlue,
    backgroundColor: theme.green,
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: SearchResult
}

class _RewardItem extends Component<Props> {
  render() {
    const { reward, classes } = this.props
    let outOfStock = reward?.quantity === 0
    let lowQuanity = reward?.quantity !== undefined && reward?.quantity > 0
    return (
      <div key={reward?.id} className={classnames(classes.container)}>
        <SmartLink to={reward?.url}>
          <AspectRatio ratio={'323/433'}>
            {reward ? (
              <Img
                className={classes.image}
                src={reward?.image}
                draggable={false}
                alt=""
                loader={<Skeleton height={'100%'} />}
                unloader={<RewardMissingImage text={reward?.name} />}
              />
            ) : (
              <Skeleton height={'100%'} />
            )}
          </AspectRatio>
          <div className={classes.textContainer}>
            <div className={classes.nameText}>{reward ? reward.name : <Skeleton />}</div>
            <div className={classes.subTextContainer}>
              <div className={classnames(classes.priceText, { [classes.outOfStockPrice]: outOfStock })}>
                {reward ? reward?.price ? `$${reward?.price.toFixed(2)}` : 'FREE' : <Skeleton width={100} />}
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
          </div>
        </SmartLink>
      </div>
    )
  }
}

export const RewardItem = withStyles(styles)(_RewardItem)
