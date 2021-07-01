import { Layout, LevelCard, Text } from '@saladtechnologies/garden-components'
import { useMemo } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { useIntl } from 'react-intl'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import { Level } from '../../seasons/models'

const styles = (theme: SaladTheme) => ({
  levels: {
    alignItems: 'flex-end',
    display: 'flex',
    overflowX: 'scroll',
    paddingTop: '64px',
    paddingBottom: '24px',
    scrollbarColor: 'light',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      height: '10px',
      color: '#DBF1C1',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#DBF1C1',
      width: '10px',
      height: '10px',
    },
    '&::-webkit-scrollbar-track': {
      borderBottom: 'solid 3px',
      color: '#DBF1C1',
    },
    '& > div:first-child': {
      paddingLeft: 25,
    },
    '& > div': {
      paddingBottom: 12,
      paddingRight: 25,
    },
  },
  page: {
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    color: theme.darkBlue,
    flex: 1,
  },
  subtitle: {
    paddingBottom: '48px',
  },
  subtitleLabel: {
    display: 'inline-block',
  },
  subtitleTime: {
    background: theme.darkBlue,
    color: '#ffffff',
    display: 'inline-block',
    marginLeft: 15,
    padding: '2px 8px',
  },
  xp: {
    fontWeight: 'bold',
    marginTop: 16,
  },
})

interface CurrentSeasonPageProps extends WithStyles<typeof styles> {
  currentLevelXP: number
  duration: string
  levels: Level[]
  nextLevel: number
  timeLeft: string
  totalXP: number
}

const _CurrentSeasonPage = ({
  classes,
  currentLevelXP,
  duration,
  levels,
  nextLevel,
  timeLeft,
  totalXP,
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
    <div className={classes.page}>
      <Scrollbars>
        <Layout title="Current Season">
          <Head title="Current Season" />
          {duration.length && timeLeft.length ? (
            <div className={classes.subtitle}>
              <div className={classes.subtitleLabel}>
                <Text variant="baseL">{duration}</Text>
              </div>
              <div className={classes.subtitleTime}>
                <Text variant="baseS">{timeLeft}</Text>
              </div>
            </div>
          ) : null}
          <div>
            <Text variant="baseXL">Season XP</Text>
          </div>
          <div>
            <Text variant="baseL">For every minute that you run Salad, you earn 1 XP</Text>
          </div>
          <div className={classes.xp}>
            <Text variant="base4XL">{intl.formatNumber(totalXP)}</Text>
          </div>
          {levelCards.length > 0 && (
            <div className={classes.levels}>
              {levelCards.map((levelCard) => (
                <LevelCard
                  alt={levelCard.alt}
                  earnedAt={levelCard.earnedAt}
                  level={levelCard.level}
                  src={levelCard.src}
                  xpCurrent={levelCard.xpCurrent}
                  xpRequired={levelCard.xpRequired}
                />
              ))}
            </div>
          )}
        </Layout>
      </Scrollbars>
    </div>
  )
}

export const CurrentSeasonPage = withLogin(withStyles(styles)(_CurrentSeasonPage))
