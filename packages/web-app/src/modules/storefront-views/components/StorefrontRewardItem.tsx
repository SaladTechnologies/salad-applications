import classnames from 'classnames'
import { Component } from 'react'
import AspectRatio from 'react-aspect-ratio'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import { SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { RewardMissingImage } from '../../reward-views/components/RewardMissingImage'

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
    objectFit: 'scale-down',
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
  name?: string
  image: string
  lowQuantity: boolean
  outOfStock: boolean
  link: string
  price?: string
  quantity?: number
}

class _StorefrontRewardItem extends Component<Props> {
  render() {
    const { image, lowQuantity, outOfStock, name, price, link, quantity, classes } = this.props
    return (
      <SmartLink className={classnames(classes.container)} to={link}>
        <AspectRatio ratio={'323/433'}>
          {image ? (
            <Img
              className={classes.image}
              src={image}
              draggable={false}
              alt=""
              loader={<Skeleton height={'100%'} />}
              unloader={<RewardMissingImage text={name} />}
            />
          ) : (
            <Skeleton height={'100%'} />
          )}
        </AspectRatio>
        <div className={classes.textContainer}>
          <div className={classes.nameText}>{name ? name : <Skeleton />}</div>
          <div className={classes.subTextContainer}>
            <div className={classnames(classes.priceText, { [classes.outOfStockPrice]: outOfStock })}>
              {price ? price : <Skeleton width={100} />}
            </div>
            {outOfStock && (
              <div className={classnames(classes.priceText, classes.stockLabel, classes.outOfStockLabel)}>
                Out of Stock
              </div>
            )}
            {lowQuantity && !outOfStock && (
              <div className={classnames(classes.priceText, classes.stockLabel, classes.lowQuanityLabel)}>
                {`${quantity} Remaining`}
              </div>
            )}
          </div>
        </div>
      </SmartLink>
    )
  }
}

export const StorefrontRewardItem = withStyles(styles)(_StorefrontRewardItem)
