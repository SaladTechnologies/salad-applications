import type CSS from 'csstype'
import Scrollbars from 'react-custom-scrollbars'
import type { IntlShape } from 'react-intl'
import { injectIntl } from 'react-intl'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import defaultAchievementImage from '../assets/Achievement.png'
import { AchievementCard } from './AchievementCard'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  achievementPageWrapper: {
    width: '100%',
    height: '100%',
    padding: '30px',
    boxSizing: 'border-box',
  },
  achievementPageGrid: {
    marginTop: '32px',
    width: '100%',
    display: 'inline-grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(296px, 4fr))',
    gridGap: '50px',
    boxSizing: 'border-box',
    marginBottom: '96px',
  },
  achievementPageHeader: {
    margin: 0,
    fontFamily: theme.fontGroteskLight09,
    color: theme.green,
    fontSize: '56px',
    fontWeight: 300,
    textShadow: '0px 0px 24px rgba(178, 213, 48, 0.7)',
  },
})

interface Props extends WithStyles<typeof styles> {
  intl: IntlShape
}

const _AchievementPage = ({ classes }: Props) => {
  const achievements = new Array(28).fill({
    title: 'When Chef’s Mix, You Earn Six',
    imageUrl: defaultAchievementImage,
    description: 'Earn your first $6',
    dateAchieved: 'Achieved on Sept 8, 2023',
    isAchieved: true,
  })
  return (
    <Scrollbars>
      <div className={classes.achievementPageWrapper}>
        <h2 className={classes.achievementPageHeader}>Achievements</h2>
        <div className={classes.achievementPageGrid}>
          {achievements.map((achievement) => (
            <AchievementCard
              title={achievement.title}
              imageUrl={achievement.imageUrl}
              description={achievement.description}
              dateAchieved={achievement.dateAchieved}
              isAchieved={achievement.isAchieved}
            />
          ))}
        </div>
      </div>
    </Scrollbars>
  )
}

export const AchievementPage = withLogin(withStyles(styles)(injectIntl(_AchievementPage)))
