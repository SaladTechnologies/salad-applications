import { Button, Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import { SettingsPanel } from '../components/SettingsPanel'

export interface AutoLaunchSettingProps {
  autoLaunchEnabled: boolean
  onToggleAutoLaunch: () => void
}

export const AutoLaunchSetting = ({ autoLaunchEnabled, onToggleAutoLaunch }: AutoLaunchSettingProps) => {
  return (
    <SettingsPanel
      title="Auto Launch"
      leftColumn={<LeftColumn />}
      rightColumn={<RightColumn autoLaunchEnabled={autoLaunchEnabled} onToggleAutoLaunch={onToggleAutoLaunch} />}
    />
  )
}

const leftColumnStyles = () => ({
  textContainer: {
    marginBottom: 24,
  },
})

interface LeftColumnProps extends WithStyles<typeof leftColumnStyles> {}

const _LeftColumn = ({ classes }: LeftColumnProps) => {
  return (
    <>
      <div className={classes.textContainer}>
        <Text variant="baseL">Automatically launch Salad at startup.</Text>
      </div>
      <Text variant="baseS">
        We recommend enabling this feature in conjunction with Auto Start for to maximize earnings.
      </Text>
    </>
  )
}

const LeftColumn = withStyles(leftColumnStyles)(_LeftColumn)

interface RightColumnProps {
  autoLaunchEnabled: boolean
  onToggleAutoLaunch: () => void
}

const RightColumn = ({ autoLaunchEnabled, onToggleAutoLaunch }: RightColumnProps) => {
  return <Button label={`${autoLaunchEnabled ? 'Disable' : 'Enable'} Auto Launch`} onClick={onToggleAutoLaunch} />
}
