import { Button, Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import { SettingsPanel } from '../components/SettingsPanel'

export interface LogsSettingProps {
  onShowLogFolder: () => void
}

export const LogsSetting = ({ onShowLogFolder }: LogsSettingProps) => {
  return (
    <SettingsPanel
      title="Logs"
      leftColumn={<LeftColumn />}
      rightColumn={<RightColumn onShowLogFolder={onShowLogFolder} />}
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
        <Text variant="baseL">
          If you’re having issues with Salad, our Support team may request that you upload your application log files.
          Click "Show Log Folder" to navigate to where they are stored.
        </Text>
      </div>
      <Text variant="baseS">Please attach only the requested log files to your open technical support ticket.</Text>
    </>
  )
}

const LeftColumn = withStyles(leftColumnStyles)(_LeftColumn)

interface RightColumnProps {
  onShowLogFolder: () => void
}

const RightColumn = ({ onShowLogFolder }: RightColumnProps) => {
  return <Button label="Show Log Folder" onClick={onShowLogFolder} />
}
