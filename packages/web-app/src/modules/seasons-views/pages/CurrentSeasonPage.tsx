import { Layout, Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import { Level } from '../../seasons/models'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.darkBlue,
    display: 'flex',
    flexDirection: 'column',
  },
  levels: {
    display: 'flex',
  },
  subtitle: {
    alignItems: 'center',
    display: 'flex',
    margin: '-45px 0 45px 0',
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
  },
})

interface Props extends WithStyles<typeof styles> {
  duration: string
  levels: Level[]
  timeLeft: string
  totalXP: number
}

const _CurrentSeasonPage = ({ classes, duration, levels, timeLeft, totalXP }: Props) => {
  return (
    <div style={{ flex: 1, backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)' }}>
      <Layout title="Current Season">
        <Head title="Current Season" />
        <div className={classes.container}>
          {duration.length && timeLeft.length ? (
            <div className={classes.subtitle}>
              <Text variant="baseL">{duration}</Text>
              <div className={classes.timeLeft}>
                <Text variant="baseS">{timeLeft}</Text>
              </div>
            </div>
          ) : null}
          <Text variant="baseXL">Season XP</Text>
          <Text variant="baseL">For every minute that you run Salad, you earn 1 XP</Text>
          <div className={classes.xp}>
            <Text variant="base4XL">{totalXP}</Text>
          </div>
          {levels.length > 0 && (
            <div className={classes.levels}>
              {levels.map((level) => (
                <div key={level.id}>
                  <p>{level.bonusImageUrl}</p>
                  <p>{level.earnedAt}</p>
                  <p>{level.xpRequired}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </div>
  )
}

export const CurrentSeasonPage = withLogin(withStyles(styles)(_CurrentSeasonPage))
