import classnames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Checkbox, InfoButton } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'

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
})

interface Props extends WithStyles<typeof styles> {
  compatibleGpus?: boolean
  cpuEnabled?: boolean
  onSetCpuEnabled?: (value: boolean) => void
}

class _CpuSummary extends Component<Props> {
  handleToggle = () => {
    const { onSetCpuEnabled, cpuEnabled } = this.props

    onSetCpuEnabled?.(!cpuEnabled)
  }

  render() {
    const { compatibleGpus, cpuEnabled, classes } = this.props

    //Hide the panel if there are compatible GPUs
    if (compatibleGpus) return null

    return (
      <div className={classes.container}>
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

        <Checkbox checked={cpuEnabled} onClick={this.handleToggle} text={'Allow Salad to use my CPU'} />

        {/* {(!gpus || !gpus.some((x) => x.compatible)) && (
          <div className={classes.warningText}>
            No compatible GPUs found. Learn more{' '}
            <SmartLink to="https://support.salad.io/hc/en-us/articles/360048320131-Is-My-Machine-Compatible-With-Salad-">
              here
            </SmartLink>
          </div>
        )} */}
      </div>
    )
  }
}

export const CpuSummary = withStyles(styles)(_CpuSummary)
