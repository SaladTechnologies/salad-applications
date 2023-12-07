import { SvgIcon, Text } from '@saladtechnologies/garden-components'
import { ArrowUp, Download } from '@saladtechnologies/garden-icons'
import type CSS from 'csstype'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'

const styles: () => Record<string, CSS.Properties> = () => ({
  installReminderWrapper: {
    width: '100%',
    height: '55px',
    background: 'linear-gradient(124deg, #53A626 29.71%, #B2D530 88.74%)',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: '16px',
    paddingRight: '16px',
    justifyContent: 'flex-end',
  },
  text: {
    fontWeight: 500,
    marginLeft: '8px',
    marginRight: '8px',
  },
})

interface InstallReminderProps extends WithStyles<typeof styles> {}

const _InstallReminder: FunctionComponent<InstallReminderProps> = ({ classes }) => {
  return (
    <div className={classes.installReminderWrapper}>
      <SvgIcon size="large">
        <ArrowUp />
      </SvgIcon>
      <Text className={classes.text}>Don’t forget to install Salad in your</Text>
      <SvgIcon size="large">
        <Download />
      </SvgIcon>
      <Text className={classes.text}>download tray</Text>
    </div>
  )
}

export const InstallReminder = withStyles(styles)(_InstallReminder)
