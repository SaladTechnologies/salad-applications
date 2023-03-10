import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { InfoButton } from '../..'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
  },
  textContainer: {},
  title: {
    color: theme.mediumGreen,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  valueText: {
    color: theme.green,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 48,
    whiteSpace: 'nowrap',
    // overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

interface Props extends WithStyles<typeof styles> {
  title?: string
  values?: string[]
  hideInfo?: boolean
  infoText?: string
}

const _StatElement = ({ title, values, infoText, classes }: Props) => (
  <div className={classes.container}>
    <div className={classes.textContainer}>
      <div className={classes.title}>{title}</div>
      {values &&
        values.map((value) => (
          <div key={value} className={classes.valueText}>
            {value}
          </div>
        ))}
    </div>
    <div>{infoText && <InfoButton text={infoText} />}</div>
  </div>
)

export const StatElement = withStyles(styles)(_StatElement)
