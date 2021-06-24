import classNames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Head, Scrollbar, SectionHeader } from '../../../components'
import { withLogin } from '../../auth-views'
import { MachineInfoContainer, MinerListContainer, MinerTypeContainer } from '../../machine-views'
import { DesktopDownloadContainer } from '../DesktopDownloadContainer'
import { EarningHistoryContainer } from '../EarningHistoryContainer'
import { ShowFolderContainer } from '../ShowFolderContainer'

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
    paddingTop: '32px',
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
                <SectionHeader>Miner Type</SectionHeader>
                <MinerTypeContainer />
                <Divider />
                <SectionHeader>Machine Information</SectionHeader>
                <MachineInfoContainer />
                <Divider />
                <SectionHeader>Current Miner</SectionHeader>
                <MinerListContainer />
                <Divider />
              </>
            )}

            <EarningHistoryContainer />
            {isNative && <ShowFolderContainer />}
          </div>
        </Scrollbar>
      </div>
    )
  }
}

export const MiningPage = withLogin(withStyles(styles)(_MiningPage))
