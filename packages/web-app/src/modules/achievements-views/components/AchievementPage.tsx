import { LoadingSpinner } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useEffect } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { IntlShape } from 'react-intl'
import { injectIntl } from 'react-intl'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import type { Achievement } from '../../achievements/models/Achievement'
import { withLogin } from '../../auth-views'
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
  loadingSpinnerWrap: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {
  intl: IntlShape
  getAchievements: () => void
  achievements: Achievement[] | undefined
}

const _AchievementPage = ({ classes, achievements, getAchievements }: Props) => {
  useEffect(() => {
    getAchievements()
  }, [getAchievements])

  return (
    <Scrollbars>
      <div className={classes.achievementPageWrapper}>
        <h2 className={classes.achievementPageHeader}>Achievements</h2>
        {!achievements ? (
          <div className={classes.loadingSpinnerWrap}>
            <LoadingSpinner variant="light" size={100} />
          </div>
        ) : (
          <div className={classes.achievementPageGrid}>
            {achievements.map((achievement) => (
              <AchievementCard
                title={achievement.name}
                imageUrl={achievement.badgeImageUrl}
                description={achievement.description}
                dateAchieved={achievement.completedAt ?? undefined}
                isAchieved={!!achievement.completedAt}
              />
            ))}
          </div>
        )}
      </div>
    </Scrollbars>
  )
}

export const AchievementPage = withLogin(withStyles(styles)(injectIntl(_AchievementPage)))
