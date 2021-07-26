import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Checkbox, InfoButton, Li, P, SmartLink, ToggleSetting } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  checkBox: {
    fontSize: theme.small,
  },
  checkboxContainer: {
    alignItems: 'flex-end',
    display: 'flex',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
})

interface Props extends WithStyles<typeof styles> {
  gpuOnly?: boolean
  infoButtonText: string
  isRunning?: boolean
  compatibilityDetectionOverridden: boolean
  onSetGpuOnly?: (value: boolean) => void
  onSetOverride: (value: boolean) => void
}

const gpuDescription = 'Use your GPU to earn Salad Balance'
const cpuDescription = 'Use your CPU to earn Salad Balance'
const gpuOverrideInfo =
  'If Salad Is Unable To Detect A Compatible GPU, You Can Choose To Override GPU Detection. This Takes Longer To Start And Can Be Less Profitable.'
const cpuOverrideInfo =
  'If Salad Is Unable To Detect A Compatible CPU, You Can Choose To Override CPU Detection. This Takes Longer To Start And Can Be Less Profitable.'

class _MinerTypePanel extends Component<Props> {
  handleToggle = () => {
    const { onSetGpuOnly, gpuOnly } = this.props
    onSetGpuOnly?.(!gpuOnly)
  }

  render() {
    const { isRunning, gpuOnly, onSetOverride, compatibilityDetectionOverridden, classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.column}>
          <ToggleSetting
            title={gpuOnly ? 'GPU Mining' : 'CPU Mining'}
            disabled={isRunning}
            description={gpuOnly ? gpuDescription : cpuDescription}
            toggled={!gpuOnly}
            onToggle={this.handleToggle}
            toggleLeft="GPU"
            toggleRight="CPU"
          />
          <div className={classes.checkboxContainer}>
            <Checkbox
              checked={compatibilityDetectionOverridden}
              className={classes.checkBox}
              onClick={onSetOverride}
              text={`Override ${gpuOnly ? 'GPU' : 'CPU'} Compatibility Detection`}
            />
            <InfoButton text={gpuOnly ? gpuOverrideInfo : cpuOverrideInfo} />
          </div>
        </div>
        <div className={classes.column}>
          <P>Mining Disclaimers:</P>
          <ul>
            <Li>Background processes will significantly affect earning rates. Use while AFK.</Li>
            <Li>Earning rates may vary widely from machine to machine</Li>
            <Li>Proper cooling and maintenance is vital for performance and safety</Li>
            {!gpuOnly && (
              <Li>
                <SmartLink to="https://support.salad.com/hc/en-us/articles/360050102351-Does-CPU-Mining-Harm-My-Computer-">
                  Does CPU Mining Harm My Computer?
                </SmartLink>
              </Li>
            )}
            {gpuOnly && (
              <Li>
                <SmartLink to="https://support.salad.com/hc/en-us/articles/360028479072-Is-Salad-healthy-for-my-PC-Yes-">
                  Does GPU Mining Harm My Computer?
                </SmartLink>
              </Li>
            )}
          </ul>
        </div>
      </div>
    )
  }
}

export const MinerTypePanel = withStyles(styles)(_MinerTypePanel)
