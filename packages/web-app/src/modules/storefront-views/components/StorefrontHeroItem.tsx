import classnames from 'classnames'
import { Component } from 'react'
import AspectRatio from 'react-aspect-ratio'
import 'react-aspect-ratio/aspect-ratio.css'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import { Button, SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { RewardMissingImage } from '../../reward-views/components/RewardMissingImage'
import { getPercentOff } from '../../reward/utils'
import { StorefrontRewardItemProps } from '../../storefront/models'

const styles = (theme: SaladTheme) => ({
  content: {
    margin: '0 auto', //Centers the content
    maxWidth: 1000,
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
    width: '30%',
    height: '50%',
    minWidth: 300,
    minHeight: 180,
    right: 30,
    zIndex: 2,
  },
  infoContent: {
    padding: '6px 24px',
    zIndex: 2,
    backdropFilter: 'blur(8.57952px)',
    background:
      'linear-gradient(104.2deg, rgba(41, 105, 45, 0.6) -28.93%, rgba(41, 105, 45, 0.48) 19.91%, rgba(83, 166, 38, 0.6) 49.73%, rgba(51, 130, 56, 0.6) 88.28%)',
    border: '1px solid rgba(219, 241, 193, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    textShadow: '0px 0px 5px rgba(178, 213, 48, 0.5), -1px -1px 3px rgba(0, 0, 0, 0.25)',
    height: '100%',
  },
  nameText: {
    fontFamily: theme.fontGroteskLight09,
    fontSize: 42,
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
  body: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
    flex: 2,
    lineHeight: '150%',
    paddingTop: 8,
  },
  buttonContainer: {
    marginLeft: -8,
  },
  discountLabel: {
    fontFamily: theme.fontGroteskBook19,
    color: theme.darkBlue,
    backgroundColor: theme.cyan,
    fontSize: 12,
    letterSpacing: 1,
    paddingLeft: 5,
    paddingRight: 10,
    marginRight: 8,
    marginTop: 3,
  },
  originalPrice: {
    textDecoration: 'line-through',
    opacity: 0.5,
    color: theme.green,
  },
})

interface Props extends WithStyles<typeof styles> {
  altText: string
  body: string
  buttonLabel: string
  buttonLink: string
  heading?: string
  image?: string
  lowQuantity: boolean
  outOfStock: boolean
  quantity?: number
  subheading?: string
  reward?: StorefrontRewardItemProps
}

class _StorefrontHeroItem extends Component<Props> {
  render() {
    const {
      altText,
      body,
      buttonLabel,
      buttonLink,
      heading,
      image,
      lowQuantity,
      outOfStock,
      subheading,
      reward,
      quantity,
      classes,
    } = this.props

    return (
      <div className={classes.content}>
        <SmartLink to={buttonLink}>
          <div className={classes.imageContainer}>
            <AspectRatio ratio={'800/450'}>
              {image ? (
                <Img
                  className={classes.image}
                  src={image}
                  draggable={false}
                  alt={altText}
                  loader={<Skeleton height={'100%'} />}
                  unloader={<RewardMissingImage text={heading || ''} />}
                />
              ) : (
                <Skeleton height={'100%'} />
              )}
            </AspectRatio>
          </div>
        </SmartLink>

        <div className={classes.infoContainer}>
          {image ? (
            <div className={classes.infoContent}>
              {heading && <div className={classes.nameText}>{heading}</div>}
              {subheading !== undefined && (
                <div className={classes.priceContainer}>
                  {reward && reward.originalPrice && !outOfStock && (
                    <div className={classnames(classes.discountLabel)}>
                      {getPercentOff(reward.originalPrice, reward.price)}{' '}
                    </div>
                  )}
                  {reward && reward.originalPrice && !outOfStock ? (
                    <span className={classes.priceText}>
                      <span className={classes.originalPrice}>{reward.originalPrice}</span> {reward.price}
                    </span>
                  ) : (
                    <div className={classnames(classes.priceText, { [classes.outOfStockPrice]: outOfStock })}>
                      {subheading}
                    </div>
                  )}
                  {outOfStock && (
                    <div className={classnames(classes.priceText, classes.stockLabel, classes.outOfStockLabel)}>
                      Out of Stock
                    </div>
                  )}
                  {lowQuantity && !outOfStock && !reward?.originalPrice && (
                    <div className={classnames(classes.priceText, classes.stockLabel, classes.lowQuanityLabel)}>
                      {`${quantity} Remaining`}
                    </div>
                  )}
                </div>
              )}
              <div className={classes.body}>{body}</div>
              <div className={classes.buttonContainer}>
                <SmartLink to={buttonLink} trackingInfo={{ label: buttonLabel }}>
                  <Button disabled={buttonLabel === undefined}>{buttonLabel}</Button>
                </SmartLink>
              </div>
            </div>
          ) : (
            <Skeleton height={'100%'} />
          )}
        </div>
      </div>
    )
  }
}

export const StorefrontHeroItem = withStyles(styles)(_StorefrontHeroItem)
