import type { FunctionComponent } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import type { SaladTheme } from '../../../../../SaladTheme'
import defaultRewardImage from '../../../assets/default-reward-image.svg'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: 180,
  },
  imageWrapper: {
    position: 'relative',
    height: 241,
    width: '100%',
    marginBottom: 32,
    border: '4px solid transparent',
  },
  image: {
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    filter: 'drop-shadow(8px 14px 21px rgba(0, 0, 0, 0.45))',
  },
  name: {
    color: theme.lightGreen,
    textAlign: 'left',
    fontFamily: theme.fontGroteskLight09,
    fontWeight: 300,
    fontSize: 48,
    lineHeight: '48px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    marginTop: 'auto',
    marginBottom: 4,
  },
  date: {
    textAlign: 'left',
    color: theme.green,
    fontFamily: theme.fontGroteskBook25,
    fontWeight: 400,
    fontSize: 12,
    lineHeight: '18px',
    marginTop: 'auto',
  },
})

interface Props extends WithStyles<typeof styles> {
  id: string
  name: string
  coverImage?: string
  timestamp: Date
}

const _LatestRewardsRedeemedCard: FunctionComponent<Props> = ({ classes, id, name, coverImage, timestamp }) => (
  <div className={classes.container} key={id}>
    <div className={classes.imageWrapper}>
      <Img
        className={classes.image}
        src={coverImage ?? defaultRewardImage}
        draggable={false}
        alt={name}
        loader={<Skeleton height={'100%'} />}
      />
    </div>
    <div className={classes.name}>{name}</div>
    <div className={classes.date}>Redeemed {timestamp?.toLocaleDateString()}</div>
  </div>
)

export const LatestRewardsRedeemedCard = withStyles(styles)(_LatestRewardsRedeemedCard)
