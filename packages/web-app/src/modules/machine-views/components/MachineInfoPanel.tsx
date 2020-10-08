import classnames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import * as si from 'systeminformation'
import { InfoButton, SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { GpuInformation } from '../../machine/models'

const styles = (theme: SaladTheme) => ({
  container: {
    padding: 10,
    overflow: 'hidden',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  firstColumn: {
    flex: '2 1',
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flex: '1 1',
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  titleRow: {
    color: theme.mediumGreen,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  contentRow: {
    color: theme.green,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 48,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  disabled: {
    opacity: 0.3,
    textDecoration: 'line-through',
  },
  warningText: {
    color: theme.orange,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    paddingTop: 25,
    textAlign: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {
  gpuEnabled?: boolean
  cpuEnabled?: boolean
  gpus?: GpuInformation[]
  cpuCompatible?: boolean
  cpu?: si.Systeminformation.CpuData
  ram?: si.Systeminformation.MemLayoutData[]
}

const gpuCompatibleTooltip = 'This graphics card has the chops. Start Salad now to get earning'
const gpuIncompatibleTooltip = `This graphics card doesn't have the chops to run Salad`
const cpuCompatibleTooltip = 'This CPU has the chops. Start Salad now to get earning'
const cpuIncompatibleTooltip = `This CPU doesn't have the chops to run Salad`

class _MachineInfoPanel extends Component<Props> {
  render() {
    const { gpuEnabled, cpuEnabled, gpus, cpu, ram, cpuCompatible, classes } = this.props

    if (!gpus) return null

    return (
      <div className={classes.container}>
        {gpuEnabled && (
          <div>
            <div className={classnames(classes.row, classes.titleRow)}>
              <div className={classes.firstColumn}>Graphics Card</div>
              <div className={classes.column}>VRAM</div>
              <div className={classes.column}>
                Driver Version
                <InfoButton
                  text={"The driver version isn't available for all GPUs. Don't worry if it isn't listed below."}
                />
              </div>
            </div>

            {gpus
              .sort((a, b) => b.vram - a.vram)
              .map((x) => (
                <div className={classnames(classes.row, classes.contentRow, { [classes.disabled]: !x.compatible })}>
                  <div className={classes.firstColumn}>
                    {x.model}
                    <InfoButton text={x.compatible ? gpuCompatibleTooltip : gpuIncompatibleTooltip} />
                  </div>
                  <div className={classes.column}>{Math.round(x.vram / 256) / 4} GB</div>
                  <div className={classes.column}>{x.driverVersion || '-'}</div>
                </div>
              ))}

            {(!gpus || !gpus.some((x) => x.compatible)) && (
              <div className={classes.warningText}>
                No compatible GPUs found. Learn more{' '}
                <SmartLink to="https://support.salad.io/hc/en-us/articles/360048320131-Is-My-Machine-Compatible-With-Salad-">
                  here
                </SmartLink>
              </div>
            )}
          </div>
        )}
        {cpuEnabled && (
          <div>
            <div className={classnames(classes.row, classes.titleRow)}>
              <div className={classes.firstColumn}>CPU</div>
              <div className={classes.column}>RAM</div>
            </div>

            <div className={classnames(classes.row, classes.contentRow, { [classes.disabled]: !cpuCompatible })}>
              <div className={classes.firstColumn}>
                {`${cpu?.manufacturer} ${cpu?.brand}`}
                <InfoButton text={cpuCompatible ? cpuCompatibleTooltip : cpuIncompatibleTooltip} />
              </div>
              <div className={classes.column}>
                {ram && ram.reduce((amount, memory) => amount + memory.size, 0) / (1024 * 1024 * 1024)} GB
              </div>
            </div>

            {/* TODO: Update this with CPU information */}
            {!cpuCompatible && (
              <div className={classes.warningText}>
                No compatible CPU found. Learn more{' '}
                <SmartLink to="https://support.salad.io/hc/en-us/articles/360048320131-Is-My-Machine-Compatible-With-Salad-">
                  here
                </SmartLink>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export const MachineInfoPanel = withStyles(styles)(_MachineInfoPanel)
