import { SvgIcon, Text } from '@saladtechnologies/garden-components'
import { ArrowUp, Download, X } from '@saladtechnologies/garden-icons'
import type CSS from 'csstype'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  installReminderWrapper: {
    width: '100%',
    height: '55px',
    background: 'linear-gradient(124deg, #53A626 29.71%, #B2D530 88.74%)',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: '16px',
    paddingRight: '16px',
    justifyContent: 'space-between',
  },
  installReminderContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  closeIcon: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    color: theme.darkBlue,
  },
  text: {
    fontWeight: 500,
    marginLeft: '8px',
    marginRight: '8px',
  },
})

interface InstallReminderProps extends WithStyles<typeof styles> {
  onCloseClick: () => void
}

const _InstallReminder: FunctionComponent<InstallReminderProps> = ({ classes, onCloseClick }) => {
  return (
    <div className={classes.installReminderWrapper}>
      <X className={classes.closeIcon} onClick={onCloseClick} />
      <div className={classes.installReminderContent}>
        <SvgIcon size="large">
          <ArrowUp />
        </SvgIcon>
        <Text className={classes.text}>Don’t forget to install Salad in your</Text>
        <SvgIcon size="large">
          <Download />
        </SvgIcon>
        <Text className={classes.text}>download tray</Text>
      </div>
    </div>
  )
}

export const InstallReminder = withStyles(styles)(_InstallReminder)
