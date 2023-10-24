import classNames from 'classnames'
import type CSS from 'csstype'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import type { SaladTheme } from '../../../SaladTheme'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  achievementCardWrapper: {
    width: '346px',
    height: '179px',
    position: 'relative',
    opacity: 0.35,
    backgroundColor: theme.darkBlue,
  },
  achievementCardWrapperAchieved: {
    opacity: 1,
  },
  achievementImage: {
    position: 'relative',
    width: '155px',
    height: '155px',
  },
  achievementTitle: {
    fontFamily: theme.fontMallory,
    fontSize: theme.medium,
    fontWeight: 700,
    color: theme.green,
    margin: 0,
  },
  achievementDescription: {
    fontFamily: theme.fontMallory,
    fontSize: theme.medium,
    color: theme.lightGreen,
    width: '155px',
    margin: 0,
  },
  achievementContent: {
    position: 'absolute',
    top: '43px',
    left: '68px',
    width: '278px',
    height: '86px',
    padding: '24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '8px',
    flexShrink: 0,
    borderRadius: '4px',
    border: '1px solid rgba(234, 236, 239, 0.5) ',
    background:
      'linear-gradient(187deg, rgba(252, 252, 252, 0.06) -32.65%, rgba(252, 252, 252, 0.01) 33.12%, rgba(252, 252, 252, 0.06) 56.13%, rgba(252, 252, 252, 0.12) 99.63%)',
    boxShadow:
      '16px 8px 73px 0px rgba(252, 252, 252, 0.05), 34px 34px 50px 0px rgba(0, 0, 0, 0.10), -8px -6px 80px 0px rgba(252, 252, 252, 0.05) inset',
    backdropFilter: 'blur(17.5px)',
  },

  achievementDate: {
    fontFamily: theme.fontMallory,
    fontSize: theme.small,
    position: 'absolute',
    right: 0,
    top: '140px',
    color: '#859099',
    textAlign: 'right',
    margin: 0,
  },
})

interface Props extends WithStyles<typeof styles> {
  imageUrl: string
  title: string
  description: string
  isAchieved: boolean
  dateAchieved?: string
}

const _AchievementCard = ({ title, imageUrl, description, isAchieved, dateAchieved, classes }: Props) => {
  return (
    <div
      className={classNames(classes.achievementCardWrapper, isAchieved && classes.achievementCardWrapperAchieved)}
      aria-label={title}
    >
      <p className={classes.achievementTitle}>{title}</p>
      <div className={classes.achievementContent}>
        <p className={classes.achievementDescription}>{description}</p>
      </div>
      <Img
        className={classes.achievementImage}
        src={imageUrl}
        draggable={false}
        alt={title}
        loader={<Skeleton height={'100%'} />}
      />
      {dateAchieved && <p className={classes.achievementDate}>{dateAchieved}</p>}
    </div>
  )
}

export const AchievementCard = withStyles(styles)(_AchievementCard)
