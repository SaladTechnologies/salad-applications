import { Layout, LevelCard, Text } from '@saladtechnologies/garden-components'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import { Level } from '../../seasons/models'

const styles = (theme: SaladTheme) => ({
  levelsContainer: {
    display: 'flex',
    overflowX: 'scroll',
    scrollbarWidth: 'thin',
    scrollbarColor: 'light',
    paddingTop: '64px',
    '&::-webkit-scrollbar': {
      height: '10px',
      color: '#DBF1C1',
    },

    // Track
    '&::-webkit-scrollbar-track': {
      borderBottom: 'solid 3px',
      color: '#DBF1C1',
    },

    // handle
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#DBF1C1',
      width: '10px',
      height: '10px',
    },
  },
  subtitle: {
    display: '-webkit-inline-box',
    paddingBottom: '48px',
  },
  timeLeft: {
    background: theme.darkBlue,
    color: '#FFF',
    height: 20,
    marginLeft: 15,
    padding: '2px 8px',
  },
  xp: {
    fontWeight: 'bold',
    marginTop: 16,
    color: theme.darkBlue,
  },
  cardContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    paddingRight: '25px',
    paddingBottom: '12px',
    color: theme.darkBlue,
  },
  darkColor: {
    color: theme.darkBlue,
  },
})

interface CurrentSeasonPageProps extends WithStyles<typeof styles> {
  duration: string
  levels: Level[]
  timeLeft: string
  totalXP: number
  currentLevelXP: number
  nextLevel: number
}

const _CurrentSeasonPage = ({
  classes,
  duration,
  levels,
  timeLeft,
  totalXP,
  currentLevelXP,
  nextLevel,
}: CurrentSeasonPageProps) => {
  const intl = useIntl()

  const levelCards = useMemo(() => {
    return levels
      ? levels.map((level) => ({
          level: level.id,
          src: level.bonusImageUrl,
          alt: `level ${level.id}`,
          earnedAt: level.earnedAt || undefined,
          xpCurrent: level.id === nextLevel ? currentLevelXP : undefined,
          xpRequired: level.xpRequired,
        }))
      : []
  }, [levels, nextLevel, currentLevelXP])
  return (
    <div style={{ flex: 1, backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)' }}>
      <Layout title="Current Season">
        <Head title="Current Season" />
        <div style={{ display: 'block' }}>
          {duration.length && timeLeft.length ? (
            <div className={classes.subtitle}>
              <div className={classes.darkColor}>
                <Text variant="baseL">{duration}</Text>
              </div>
              <div className={classes.timeLeft}>
                <Text variant="baseS">{timeLeft}</Text>
              </div>
            </div>
          ) : null}
        </div>
        <div className={classes.darkColor}>
          <Text variant="baseXL">Season XP</Text>
        </div>
        <div className={classes.darkColor}>
          <Text variant="baseL">For every minute that you run Salad, you earn 1 XP</Text>
        </div>
        <div className={classes.xp}>
          <Text variant="base4XL">{intl.formatNumber(totalXP)}</Text>
        </div>
        {levelCards.length > 0 && (
          <div className={classes.levelsContainer}>
            {levelCards.map((levelCard) => (
              <div className={classes.cardContainer}>
                <LevelCard
                  level={levelCard.level}
                  src={levelCard.src}
                  alt={levelCard.alt}
                  earnedAt={levelCard.earnedAt}
                  xpRequired={levelCard.xpRequired}
                  xpCurrent={levelCard.xpCurrent}
                />
              </div>
            ))}
          </div>
        )}
      </Layout>
    </div>
  )
}

export const CurrentSeasonPage = withLogin(withStyles(styles)(_CurrentSeasonPage))
