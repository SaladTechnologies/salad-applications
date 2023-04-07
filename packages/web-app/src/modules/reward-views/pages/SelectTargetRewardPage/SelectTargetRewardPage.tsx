import type { FunctionComponent } from 'react'
import { useEffect } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import classNames from 'classnames'
import { Button, Scrollbar } from '../../../../components'
import type { Reward } from '../../../reward/models'
import { RewardMissingImage } from '../../components/RewardMissingImage'
import type { SaladTheme } from '../../../../SaladTheme'
import SaladBackgroundURL from '../assets/saladBackground.png'
import { RewardsList } from './RewardsList'

export const styles = (theme: SaladTheme) => ({
  pageWrapper: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  rewardsWrapper: {
    gap: '32px',
    padding: '70px 0px 0px 70px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    margin: 0,
    fontFamily: theme.fontGroteskLight09,
    color: theme.green,
    fontSize: '96px',
    fontWeight: 300,
    textShadow: '0px 0px 24px rgba(178, 213, 48, 0.7)',
  },
  description: {
    fontFamily: 'Mallory',
    color: theme.lightGreen,
    fontSize: '16px',
    lineHeight: '24px',
  },
  backgroundImage: {
    backgroundImage: `url(${SaladBackgroundURL})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '1343px',
    flex: 1,
  },
  targetRewardImage: {
    position: 'relative',
    height: 241,
    width: 180,
    marginBottom: 32,
    boxSizing: 'border-box',
    filter: 'drop-shadow(8px 14px 21px rgba(0, 0, 0, 0.45))',
  },
  targetRewardWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  targetRewardDetails: {
    padding: 32,
  },

  targetRewardDetailsContent: {
    marginLeft: 8,
    marginBottom: 48,
  },
  targetRewardName: {
    color: theme.lightGreen,
    textAlign: 'left',
    fontFamily: theme.fontGroteskLight09,
    fontWeight: 300,
    fontSize: 64,
    lineHeight: '48px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    marginTop: 'auto',
  },
  targetRewardPrice: {
    textAlign: 'left',
    color: theme.green,
    fontFamily: theme.fontGroteskBook25,
    fontWeight: 400,
    fontSize: 24,
    lineHeight: '18px',
    marginTop: 16,
  },
})

interface Props extends WithStyles<typeof styles> {
  recommendedRewards: Reward[]
  targetReward: Reward
  onConfirmTargetReward: (reward: Reward) => void
  onSelectDifferentReward: () => void
  getRecommendedRewards: () => void
}

const _SelectTargetRewardPage: FunctionComponent<Props> = ({
  classes,
  recommendedRewards,
  targetReward,
  onConfirmTargetReward,
  onSelectDifferentReward,
  getRecommendedRewards,
}) => {
  useEffect(() => {
    getRecommendedRewards()
  }, [getRecommendedRewards])

  return (
    <Scrollbar>
      <div className={classNames(classes.pageWrapper, targetReward && classes.overflowHidden)}>
        <div className={classes.rewardsWrapper}>
          {targetReward ? (
            <>
              <div>
                <h1 className={classes.header}>You’ve selected a reward!</h1>
                <p className={classes.description}>Start chopping with the Salad App to earn towards your reward!</p>
              </div>
              <div className={classes.targetRewardWrapper}>
                <Img
                  className={classes.targetRewardImage}
                  src={targetReward.coverImage ?? ''}
                  draggable={false}
                  alt={targetReward.name}
                  loader={<Skeleton height={'100%'} />}
                  unloader={<RewardMissingImage text={targetReward.name} />}
                />
                <div className={classes.targetRewardDetails}>
                  <div className={classes.targetRewardDetailsContent}>
                    <div className={classes.targetRewardName}>{targetReward.name}</div>
                    <div className={classes.targetRewardPrice}>${targetReward.price.toFixed(2)}</div>
                  </div>
                  <Button onClick={onSelectDifferentReward}>
                    <div>Select a Different Reward</div>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h1 className={classes.header}>Select a Reward to Target</h1>
                <p className={classes.description}>
                  You can target any of these rewards, or any other reward in the Salad store, and track your progress
                  towards redeeming it. Once you have enough balance you can get that sweet loot or get something else
                </p>
              </div>
              <RewardsList rewards={recommendedRewards} onConfirmTargetReward={onConfirmTargetReward} />
            </>
          )}
        </div>
        <div className={classes.backgroundImage}></div>
      </div>
    </Scrollbar>
  )
}

export const SelectTargetRewardPage = withStyles(styles)(_SelectTargetRewardPage)
