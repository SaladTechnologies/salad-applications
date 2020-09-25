import classNames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Head, Scrollbar, SectionHeader } from '../../../components'
import { withLogin } from '../../auth-views'
import { CpuSummaryContainer, GpuSummaryContainer, MinerListContainer } from '../../machine-views'
import { DesktopDownloadContainer } from '../DesktopDownloadContainer'
import { EarningHistoryContainer } from '../EarningHistoryContainer'

const styles = {
  container: {
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
}

interface Props extends WithStyles<typeof styles> {
  isNative?: boolean
}

class _MiningPage extends Component<Props> {
  render() {
    const { isNative, classes } = this.props

    return (
      <div className={classNames(classes.container)}>
        <Head title="Mining - Details" />
        <Scrollbar>
          <div className={classNames(classes.content)}>
            <DesktopDownloadContainer />

            {/* TODO:DRS Add an error message panel. This could be for incompatible machine, AV issues... */}
            {isNative && (
              <>
                <SectionHeader>Machine Information</SectionHeader>
                <GpuSummaryContainer />
                <Divider />

                <CpuSummaryContainer />

                <SectionHeader>Current Miner</SectionHeader>
                <MinerListContainer />
                <Divider />
              </>
            )}

            <EarningHistoryContainer />
          </div>
        </Scrollbar>
      </div>
    )
  }
}

export const MiningPage = withLogin(withStyles(styles)(_MiningPage))
