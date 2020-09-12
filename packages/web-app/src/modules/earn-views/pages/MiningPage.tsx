import classNames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Head, Scrollbar, SectionHeader } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import { GpuSummaryContainer, MinerListContainer } from '../../machine-views'
import { DesktopDownloadContainer } from '../DesktopDownloadContainer'
import { EarningHistoryContainer } from '../EarningHistoryContainer'

const styles = (theme: SaladTheme) => ({
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
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  mainColumn: {
    flex: 1,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  startContainer: {
    backgroundColor: theme.darkBlue,
    padding: 30,
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {
  isNative?: boolean
}

class _MiningPage extends Component<Props> {
  render() {
    const { isNative, classes } = this.props

    return (
      <div className={classNames(classes.container, classes.splitContainer)}>
        <Head title="Mining - Details" />
        <Scrollbar>
          <div className={classNames(classes.content, classes.splitContainer)}>
            <div className={classNames(classes.column, classes.mainColumn)}>
              <DesktopDownloadContainer />

              {/* TODO:DRS Add an error message panel. This could be for incompatible machine, AV issues... */}
              {isNative && (
                <>
                  <SectionHeader>Machine Information</SectionHeader>
                  <GpuSummaryContainer />
                  <Divider />

                  <SectionHeader>Current Miner</SectionHeader>
                  <MinerListContainer />
                  <Divider />
                </>
              )}

              <EarningHistoryContainer />
            </div>
          </div>
        </Scrollbar>
      </div>
    )
  }
}

export const MiningPage = withLogin(withStyles(styles)(_MiningPage))
