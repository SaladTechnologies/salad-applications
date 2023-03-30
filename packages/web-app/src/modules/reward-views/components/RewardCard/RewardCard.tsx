import { Button } from '@saladtechnologies/garden-components'
import classNames from 'classnames'
import type { FunctionComponent } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import type { SaladTheme } from '../../../../SaladTheme'
import { DefaultTheme } from '../../../../SaladTheme'
import type { Reward } from '../../../reward/models'
import { RewardMissingImage } from '../RewardMissingImage'

const styles = (theme: SaladTheme) => ({
  selected: {},
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: 180,
    cursor: 'pointer',
    ':is(&:hover, &$selected) $buttonWrapper': {
      display: 'block',
    },
    ':is(&:hover, &$selected) $name': {
      color: theme.mediumGreen,
    },
    ':is(&:hover) $imageWrapper': {
      background: 'linear-gradient(0deg, rgba(83, 166, 38, 0.2), rgba(83, 166, 38, 0.2))',
    },
    ':is(&$selected) $imageWrapper': {
      background: 'linear-gradient(180deg, rgba(177, 209, 53, 0.4) 0%, rgba(83, 166, 38, 0.4) 100%)',
    },
    ':is(&$selected) $image': {
      border: `4px solid ${theme.mediumGreen}`,
    },
  },
  imageWrapper: {
    display: 'flex',
    position: 'relative',
    height: 241,
    width: '100%',
    marginBottom: 32,
  },
  image: {
    zIndex: -1,
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    filter: 'drop-shadow(8px 14px 21px rgba(0, 0, 0, 0.45))',
    border: '4px solid transparent',
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
  price: {
    textAlign: 'left',
    color: theme.green,
    fontFamily: theme.fontGroteskBook25,
    fontWeight: 400,
    fontSize: 12,
    lineHeight: '18px',
    marginTop: 'auto',
  },
  buttonWrapper: {
    display: 'none',
    position: 'absolute',
    bottom: -18,
    left: 0,
    right: 0,
    margin: 'auto',
    width: 143,
  },
})

interface Props extends WithStyles<typeof styles> {
  reward: Reward
  isSelected: boolean
  onSelectReward: (rewardId: string) => void
  onConfirmReward: (reward: Reward) => void
}

const _RewardCard: FunctionComponent<Props> = ({ classes, reward, isSelected, onSelectReward, onConfirmReward }) => {
  const handleRewardClick = () => {
    if (isSelected) {
      return onConfirmReward(reward)
    }

    return onSelectReward(reward.id)
  }

  const getButton = () => {
    if (isSelected) {
      return <Button variant="primary" label="Confirm" />
    }

    return <Button variant="secondary" outlineColor={DefaultTheme.mediumGreen} label="Target" />
  }

  return (
    <div onClick={handleRewardClick} className={classNames(classes.container, isSelected && classes.selected)}>
      <div className={classes.imageWrapper}>
        <Img
          className={classes.image}
          src={reward.coverImage ?? ''}
          draggable={false}
          alt={reward.name}
          loader={<Skeleton height={'100%'} />}
          unloader={<RewardMissingImage text={reward.name} />}
        />
        <div className={classes.buttonWrapper}>{getButton()}</div>
      </div>
      <div className={classes.name}>{reward.name}</div>
      <div className={classes.price}>{reward.price.toFixed(2)}</div>
    </div>
  )
}

export const RewardCard = withStyles(styles)(_RewardCard)
