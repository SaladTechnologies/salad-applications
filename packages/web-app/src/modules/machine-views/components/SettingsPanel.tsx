import { Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  panel: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 24,
  },
  title: {
    color: theme.lightGreen,
  },
  container: {
    borderBottom: `solid 1px ${theme.lightGreen}`,
    padding: '24px 0',
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gridGap: 24,
    '@media (min-width: 900px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
    width: '100%',
  },
  column: {
    color: theme.darkBlue,
    flex: 1,
  },
})

interface SettingsPanelProps extends WithStyles<typeof styles> {
  title: string
  leftColumn: React.ReactNode
  rightColumn: React.ReactNode
}

const _SettingsPanel = ({ classes, title, leftColumn, rightColumn }: SettingsPanelProps) => {
  return (
    <div className={classes.panel}>
      <div className={classes.title}>
        <Text variant="baseXXL">{title}</Text>
      </div>
      <div className={classes.container}>
        <div className={classes.column}>{leftColumn}</div>
        <div className={classes.column}>{rightColumn}</div>
      </div>
    </div>
  )
}

export const SettingsPanel = withStyles(styles)(_SettingsPanel)
