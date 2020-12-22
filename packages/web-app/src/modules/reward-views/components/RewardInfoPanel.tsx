import classnames from 'classnames'
import { Component } from 'react'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import { Divider } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { Reward, RewardPlatform } from '../../reward/models'
import apple from './assets/logos/apple.png'
import origin from './assets/logos/origin.png'
import steam from './assets/logos/steam.png'
import xbox from './assets/logos/xbox.png'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '6px 20px',
  },
  titleText: {
    color: theme.green,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    letterSpacing: 1,
  },
  valueText: {
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 36,
  },
  platformIcon: {
    height: 32,
  },
})

interface ItemProps extends WithStyles<typeof styles> {
  title: string
  value?: any
}

const _InfoItem = ({ title, value, classes }: ItemProps) => {
  if (!value) return null
  return (
    <div className={classes.itemContainer}>
      <div className={classes.titleText}>{title}</div>
      <div className={classes.valueText}>{value}</div>
    </div>
  )
}

export const InfoItem = withStyles(styles)(_InfoItem)

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
}

const getPlatformIcon = (platform?: RewardPlatform): string | undefined => {
  if (!platform) return undefined

  switch (platform) {
    case RewardPlatform.Steam:
      return steam
    case RewardPlatform.Origin:
      return origin
    case RewardPlatform.Xbox:
      return xbox
    case RewardPlatform.Apple:
      return apple
    default:
      return undefined
  }
}

class _RewardInfoPanel extends Component<Props> {
  render() {
    const { reward, classes } = this.props

    if (!reward) {
      return null
    }

    if (!reward.releaseDate && !reward.developerName && !reward.publisherName) {
      return null
    }

    let platformIcon = getPlatformIcon(reward?.platform)

    return (
      <>
        <div className={classnames(classes.container)}>
          <InfoItem title={'Release Date'} value={reward?.releaseDate?.toLocaleDateString()} />
          <InfoItem title={'Developer'} value={reward?.developerName} />
          <InfoItem title={'Publisher'} value={reward?.publisherName} />
          <InfoItem
            title={'Platform'}
            value={platformIcon && <Img className={classes.platformIcon} src={platformIcon} alt="" />}
          />
        </div>
        <Divider />
      </>
    )
  }
}

export const RewardInfoPanel = withStyles(styles)(_RewardInfoPanel)
