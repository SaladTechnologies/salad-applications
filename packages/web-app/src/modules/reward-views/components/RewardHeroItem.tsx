import classnames from 'classnames'
import React, { Component } from 'react'
//@ts-ignore
import AspectRatio from 'react-aspect-ratio'
import 'react-aspect-ratio/aspect-ratio.css'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import { Button, SmartLink } from '../../../components'
import { rewardRoute } from '../../../RouteUtils'
import { SaladTheme } from '../../../SaladTheme'
import { SearchResult } from '../../reward/models'
import { RewardMissingImage } from './RewardMissingImage'

const styles = (theme: SaladTheme) => ({
  container: {},
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
  headlineText: {
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
})

interface Props extends WithStyles<typeof styles> {
  result?: SearchResult
}

class _RewardHeroItem extends Component<Props> {
  render() {
    const { result, classes } = this.props

    let outOfStock = result?.quantity === 0
    let lowQuanity = result?.quantity !== undefined && result?.quantity > 0

    return (
      <div key={result?.id} className={classnames(classes.container)}>
        <div className={classes.content}>
          <SmartLink to={rewardRoute(result?.id)}>
            <div className={classes.imageContainer}>
              <AspectRatio ratio={'800/450'}>
                {result ? (
                  <Img
                    className={classes.image}
                    src={result?.heroImage || ''}
                    draggable={false}
                    alt=""
                    loader={<Skeleton height={'100%'} />}
                    unloader={<RewardMissingImage text={result?.name} />}
                  />
                ) : (
                  <Skeleton height={'100%'} />
                )}
              </AspectRatio>
            </div>
          </SmartLink>

          <div className={classes.infoContainer}>
            {result ? (
              <div className={classes.infoContent}>
                <div className={classes.nameText}>{result?.name}</div>
                <div className={classes.priceContainer}>
                  <div className={classnames(classes.priceText, { [classes.outOfStockPrice]: outOfStock })}>
                    {result?.price ? `$${result?.price.toFixed(2)}` : 'FREE'}
                  </div>
                  {outOfStock && (
                    <div className={classnames(classes.priceText, classes.stockLabel, classes.outOfStockLabel)}>
                      Out of Stock
                    </div>
                  )}
                  {lowQuanity && (
                    <div className={classnames(classes.priceText, classes.stockLabel, classes.lowQuanityLabel)}>
                      {`${result?.quantity} Remaining`}
                    </div>
                  )}
                </div>
                <div className={classes.headlineText}>{result?.description}</div>
                <div className={classes.buttonContainer}>
                  <SmartLink to={rewardRoute(result.id)}>
                    <Button disabled={result === undefined}>GET IT NOW</Button>
                  </SmartLink>
                </div>
              </div>
            ) : (
              <Skeleton height={'100%'} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export const RewardHeroItem = withStyles(styles)(_RewardHeroItem)
