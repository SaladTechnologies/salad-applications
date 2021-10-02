import { Button, Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import { SettingsPanel } from '../components/SettingsPanel'

export interface AntivirusSettingProps {
  detectedAV?: string
  onWhitelistWindowsDefender?: () => void
  onViewAVGuide: () => void
  onViewAVList: () => void
}

export const AntivirusSetting = ({
  detectedAV,
  onWhitelistWindowsDefender,
  onViewAVGuide,
  onViewAVList,
}: AntivirusSettingProps) => {
  return (
    <SettingsPanel
      title="Antivirus"
      leftColumn={<LeftColumn />}
      rightColumn={
        <RightColumn
          detectedAV={detectedAV}
          onViewAVGuide={onViewAVGuide}
          onViewAVList={onViewAVList}
          onWhitelistWindowsDefender={onWhitelistWindowsDefender}
        />
      }
    />
  )
}

const LeftColumn = () => {
  return (
    <Text variant="baseL">
      If your Antivirus program is flagging Salad by mistake, whitelist Salad in Windows Defender or follow our
      step-by-step guide to whitelisting with your specific Antivirus.{' '}
    </Text>
  )
}

const rightColumnStyles = () => ({
  buttonContainer: {
    marginBottom: 24,
  },
  underline: {
    textDecoration: 'underline',
  },
})

interface RightColumnProps extends WithStyles<typeof rightColumnStyles> {
  onWhitelistWindowsDefender?: () => void
  onViewAVGuide: () => void
  onViewAVList: () => void
  detectedAV?: string
}

const _RightColumn = ({
  classes,
  detectedAV,
  onViewAVGuide,
  onViewAVList,
  onWhitelistWindowsDefender,
}: RightColumnProps) => {
  return (
    <>
      <div className={classes.buttonContainer}>
        <Button label="Whitelist Salad in Windows Defender" onClick={onWhitelistWindowsDefender} />
      </div>
      {detectedAV !== undefined && (
        <div className={classes.buttonContainer}>
          <Button variant="outlined" label={`Open ${detectedAV} Guide`} onClick={onViewAVGuide} />
        </div>
      )}
      <Text variant="baseS">
        Use a different antivirus provider?{' '}
        <span className={classes.underline} onClick={onViewAVList}>
          Select it here
        </span>
        .
      </Text>
    </>
  )
}

const RightColumn = withStyles(rightColumnStyles)(_RightColumn)
