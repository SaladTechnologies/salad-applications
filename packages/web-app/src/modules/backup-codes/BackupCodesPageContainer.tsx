import { useBackupCodesLoad } from '../../account/account-security.ts'
import { connect } from '../../connect'
import { useNavigation } from '../../routing/navigation-context.ts'
import type { RootStore } from '../../Store'
import { getStore } from '../../Store'
import { BackupCodesPage } from './components'

const mapStoreToProps = (store: RootStore, props: { onBackToProfileClick: () => void }): any => ({
  backupCodes: store.backupCodes.backupCodes,
  onBackToProfileClick: props.onBackToProfileClick,
  onGenerateNewBackupCodesClick: store.backupCodes.generateBackupCodes,
})

const ConnectedBackupCodesPage = connect(mapStoreToProps, BackupCodesPage)

/** The backup codes page. It loads the codes each time it opens; they stay in the store. */
export const BackupCodesPageContainer = () => {
  const navigation = useNavigation()
  useBackupCodesLoad(getStore().backupCodes.getBackupCodes)
  return <ConnectedBackupCodesPage onBackToProfileClick={() => navigation.push('/account/summary')} />
}
