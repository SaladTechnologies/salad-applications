import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    fontFamily: 'Mallory',
  },
  title: {
    color: '#D5DADF',
    fontSize: 14,
    lineHeight: '24px',
    whiteSpace: 'nowrap',
  },
  valueText: {
    fontSize: 32,
    lineHeight: '34px',
    color: theme.green,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textShadow: `0px 0px 24px rgba(178, 213, 48, 0.70)`,
  },
})

interface Props extends WithStyles<typeof styles> {
  title: string
  value: string
}

const BalanceStatRaw = ({ title, value, classes }: Props) => (
  <div className={classes.container}>
    <div className={classes.title}>{title}</div>
    {value && (
      <div key={value} className={classes.valueText}>
        {value}
      </div>
    )}
  </div>
)

export const BalanceStat = withStyles(styles)(BalanceStatRaw)
