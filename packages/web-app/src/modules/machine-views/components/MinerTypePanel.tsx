import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Li, P, SmartLink, ToggleSetting } from '../../../components'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
}

interface Props extends WithStyles<typeof styles> {
  gpuOnly?: boolean
  isRunning?: boolean
  onSetGpuOnly?: (value: boolean) => void
}

const gpuDescription = 'Use your GPU to earn Salad Balance'
const cpuDescription = 'Use your CPU to earn Salad Balance'

class _MinerTypePanel extends Component<Props> {
  handleToggle = () => {
    const { onSetGpuOnly, gpuOnly } = this.props
    onSetGpuOnly?.(!gpuOnly)
  }

  render() {
    const { isRunning, gpuOnly, classes } = this.props

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
        </div>
        <div className={classes.column}>
          <P>Mining Disclaimers:</P>
          <ul>
            <Li>Background processes will significantly affect earning rates. Use while AFK.</Li>
            <Li>Earning rates may vary widely from machine to machine</Li>
            <Li>Proper cooling and maintenance is vital for performance and safety</Li>
            {!gpuOnly && (
              <Li>
                <SmartLink to="https://support.salad.io/hc/en-us/articles/360050102351-Does-CPU-Mining-Harm-My-Computer-">
                  Does CPU Mining Harm My Computer?
                </SmartLink>
              </Li>
            )}
            {gpuOnly && (
              <Li>
                <SmartLink to="https://support.salad.io/hc/en-us/articles/360028479072-Is-Salad-healthy-for-my-PC-Yes-">
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
