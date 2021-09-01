import { Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  box: {
    height: 'auto',
    maxWidth: 400,
    width: '100%',
  },
  buttons: {
    alignItems: 'center',
    display: 'flex',
    margin: '24px 0',
  },
  description: {
    color: theme.darkBlue,
  },
  title: {
    color: theme.lightGreen,
  },
})

export interface MachineSettingsBoxProps extends WithStyles<typeof styles> {
  buttons: React.ReactNode
  children: React.ReactNode
  title: string
}

const _MachineSettingsBox = ({ buttons, children, classes, title }: MachineSettingsBoxProps) => {
  return (
    <div className={classes.box}>
      <div className={classes.title}>
        <Text variant="baseXXL">{title}</Text>
      </div>
      <div className={classes.buttons}>{buttons}</div>
      <div>{children}</div>
    </div>
  )
}

export const MachineSettingsBox = withStyles(styles)(_MachineSettingsBox)
