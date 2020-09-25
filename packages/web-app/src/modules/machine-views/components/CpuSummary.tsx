import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Li, P, SectionHeader, SmartLink, ToggleSetting } from '../../../components'

const styles = {
  container: {},
  content: {
    padding: '0 10px',
  },
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
}

interface Props extends WithStyles<typeof styles> {
  compatibleGpus?: boolean
  cpuEnabled?: boolean
  isRunning?: boolean
  onSetCpuEnabled?: (value: boolean) => void
}

class _CpuSummary extends Component<Props> {
  handleToggle = () => {
    const { onSetCpuEnabled, cpuEnabled } = this.props

    onSetCpuEnabled?.(!cpuEnabled)
  }

  render() {
    const { compatibleGpus, cpuEnabled, isRunning, classes } = this.props

    //Hide the panel if there are compatible GPUs
    if (compatibleGpus !== false) return null

    return (
      <div className={classes.container}>
        <SectionHeader>CPU Mining</SectionHeader>
        <div className={classes.content}>
          <P>Despite your machine lacking compatible GPUs, Salad can use your CPU to earn Salad Balance as well.</P>
          <div className={classes.splitContainer}>
            <div className={classes.column}>
              <ToggleSetting
                title={'CPU Mining'}
                disabled={isRunning}
                description={'Use your CPU to mine Salad Balance.'}
                toggled={cpuEnabled}
                onToggle={this.handleToggle}
              />
            </div>
            <div className={classes.column}>
              <P>CPU Mining Disclaimers:</P>
              <ul>
                <Li>Background processes with significantly affect earning rates. Use while AFK.</Li>
                <Li>Earning rates will vary widely from machine to machine</Li>
                <Li>Proper cooling and maintenance is vital for performance and safety</Li>
                <Li>
                  <SmartLink to="https://support.salad.io/hc/en-us/articles/360050102351-Does-CPU-Mining-Harm-My-Computer-">
                    Does CPU Mining Harm My Computer?
                  </SmartLink>
                </Li>
              </ul>
            </div>
          </div>
        </div>
        <Divider />
      </div>
    )
  }
}

export const CpuSummary = withStyles(styles)(_CpuSummary)
