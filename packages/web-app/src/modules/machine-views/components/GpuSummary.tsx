import classnames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { InfoButton } from '../../../components'
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
})

interface Props extends WithStyles<typeof styles> {
  gpus?: GpuInformation[]
}

const compatibleTooltip = 'This graphics card has the chops. Start Salad Now'
const incompatibleTooltip = `This graphics card doesn't have the chops to run Salad`

class _GpuSummary extends Component<Props> {
  render() {
    const { gpus, classes } = this.props

    if (!gpus) return null

    return (
      <div className={classes.container}>
        <div className={classnames(classes.row, classes.titleRow)}>
          <div className={classes.firstColumn}>Graphics Card</div>
          <div className={classes.column}>VRAM</div>
          <div className={classes.column}>
            Driver Version
            <InfoButton
              text={'Driver version are not available on all GPUs. No need to worry if it is not listed below.'}
            />
          </div>
        </div>

        {gpus
          .sort((a, b) => b.vram - a.vram)
          .map((x) => (
            <div className={classnames(classes.row, classes.contentRow, { [classes.disabled]: !x.compatible })}>
              <div className={classes.firstColumn}>
                {x.model}
                <InfoButton text={x.compatible ? compatibleTooltip : incompatibleTooltip} />
              </div>
              <div className={classes.column}>{Math.round(x.vram / 256) / 4} GB</div>
              <div className={classes.column}>{x.driverVersion || '-'}</div>
            </div>
          ))}
      </div>
    )
  }
}

export const GpuSummary = withStyles(styles)(_GpuSummary)
