import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { BackupCodesPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  backupCodes: store.backupCodes.backupCodes,
  onBackToProfileClick: () => store.routing.push(`/account/summary`),
  onGenerateNewBackupCodesClick: store.backupCodes.generateBackupCodes,
  getBackupCodes: store.backupCodes.getBackupCodes,
})

export const BackupCodesPageContainer = connect(mapStoreToProps, BackupCodesPage)
