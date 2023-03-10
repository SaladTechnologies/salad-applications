import { Layout, LevelCard, Text } from '@saladtechnologies/garden-components'
import { useMemo } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { useIntl } from 'react-intl'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import Carousel from 'react-multi-carousel'
import { Head, SmartLink } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import type { Level } from '../../seasons/models'

const styles = (theme: SaladTheme) => ({
  levels: {
    alignItems: 'flex-end',
    display: 'flex',
    paddingBottom: '24px',
    '& > div': {
      paddingBottom: 12,
      paddingRight: 25,
    },
  },
  level: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 150,
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

const responsive = {
  desktop: {
    breakpoint: { max: Number.MAX_SAFE_INTEGER, min: 1400 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1400, min: 1000 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 1000, min: 0 },
    items: 1,
  },
}

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
  const seasonFAQ = 'Season FAQ'

  const levelCards = useMemo(() => {
    let cumulativeSum = 0
    return levels
      ? levels.map((level) => ({
          level: level.id,
          src: level.bonusImageUrl,
          alt: `level ${level.id}`,
          earnedAt: level.earnedAt || undefined,
          xpCurrent: level.id === nextLevel ? currentLevelXP : undefined,
          xpCumulativeRequiredTotal: (cumulativeSum += level.xpRequired),
          xpRequiredForLevel: level.xpRequired,
        }))
      : []
  }, [levels, nextLevel, currentLevelXP])

  nextLevel >= 2 && levelCards.push(...levelCards.splice(0, nextLevel - 1))

  return (
    <div className={classes.page}>
      <Scrollbars>
        <Layout title="Last Season Snapshot">
          <Head title="Last Season Snapshot" />
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
            <Text variant="baseL">For every minute that you run Salad, you earn 1 XP.</Text>
          </div>
          <div>
            <Text variant="baseS">
              See{' '}
              <SmartLink
                to={'https://support.salad.com/hc/en-us/articles/4402408729108-How-do-Seasons-work-'}
                trackingInfo={{ label: seasonFAQ }}
              >
                our Salad Season FAQ
              </SmartLink>{' '}
              for more information.
            </Text>
          </div>
          <div className={classes.xp}>
            <Text variant="base4XL">{intl.formatNumber(totalXP)}</Text>
          </div>
          {levelCards.length > 0 && (
            <div className={classes.levels}>
              <Carousel infinite keyBoardControl={false} responsive={responsive} arrows renderDotsOutside>
                {levelCards.map((levelCard) => (
                  <div key={levelCard.level} className={classes.level}>
                    <LevelCard
                      alt={levelCard.alt}
                      earnedAt={levelCard.earnedAt}
                      level={levelCard.level}
                      src={levelCard.src}
                      currentLevelXpEarned={levelCard.xpCurrent}
                      currentLevelXpTotalRequired={levelCard.xpRequiredForLevel}
                      cumulativeCurrentXp={totalXP}
                      cumulativeTotalRequiredXp={levelCard.xpCumulativeRequiredTotal}
                      hideTimeEstimate
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </Layout>
      </Scrollbars>
    </div>
  )
}

export const CurrentSeasonPage = withLogin(withStyles(styles)(_CurrentSeasonPage))
