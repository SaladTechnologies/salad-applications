import { Button, Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import { SmartLink } from '../../../components'
import { SettingsPanel } from '../components/SettingsPanel'

export interface AntivirusSettingProps {
  detectedAV?: string
  onWhitelistWindowsDefender?: () => void
  whitelistWindowsDefenderErrorMessage?: string
  whitelistWindowsDefenderPending?: boolean
  onViewAVGuide: () => void
  onViewAVList: () => void
}

export const AntivirusSetting = ({
  detectedAV,
  onWhitelistWindowsDefender,
  whitelistWindowsDefenderErrorMessage,
  whitelistWindowsDefenderPending,
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
          whitelistWindowsDefenderErrorMessage={whitelistWindowsDefenderErrorMessage}
          whitelistWindowsDefenderPending={whitelistWindowsDefenderPending}
        />
      }
    />
  )
}

const LeftColumn = () => {
  return (
    <Text variant="baseL">
      If your antivirus software is{' '}
      <SmartLink to="https://salad.com/blog/why-do-antivirus-programs-block-miners/">
        preventing Salad from running
      </SmartLink>
      , use this toggle to whitelist Salad in Windows Defender, or follow the step-by-step guide for your specific
      antivirus program.
    </Text>
  )
}

const rightColumnStyles = () => ({
  buttonContainer: {
    marginBottom: 24,
  },
  underline: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
})

interface RightColumnProps extends WithStyles<typeof rightColumnStyles> {
  onWhitelistWindowsDefender?: () => void
  whitelistWindowsDefenderErrorMessage?: string
  whitelistWindowsDefenderPending?: boolean
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
  whitelistWindowsDefenderErrorMessage,
  whitelistWindowsDefenderPending,
}: RightColumnProps) => {
  return (
    <>
      {onWhitelistWindowsDefender && (
        <div className={classes.buttonContainer}>
          <Button
            label="Whitelist Salad in Windows Defender"
            onClick={onWhitelistWindowsDefender}
            errorMessage={whitelistWindowsDefenderErrorMessage}
            isLoading={whitelistWindowsDefenderPending}
          />
        </div>
      )}
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
