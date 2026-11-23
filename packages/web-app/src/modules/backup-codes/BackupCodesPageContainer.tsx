import { useBackupCodesLoad } from '../../account/account-security.ts'
import type { BackupCodesState } from '../../account/backup-codes.ts'
import { useBackupCodesState } from '../../account/backup-codes.ts'
import { useNavigation } from '../../routing/navigation-context.ts'
import type { RootStore } from '../../Store'
import { useStore } from '../../Store'
import { BackupCodesPage } from './components'

const mapStoreToProps = (
  store: RootStore,
  props: { onBackToProfileClick: () => void; backupCodesState: BackupCodesState },
): any => ({
  backupCodes: props.backupCodesState.backupCodes,
  onBackToProfileClick: props.onBackToProfileClick,
  onGenerateNewBackupCodesClick: store.backupCodes.generateBackupCodes,
})

/** The backup codes page. It loads the codes each time it opens, reads them and passes them down. */
export const BackupCodesPageContainer = () => {
  const navigation = useNavigation()
  const store = useStore()
  useBackupCodesLoad(store.backupCodes.getBackupCodes)
  return (
    <BackupCodesPage
      {...mapStoreToProps(store, {
        onBackToProfileClick: () => navigation.push('/account/summary'),
        backupCodesState: useBackupCodesState(store.backupCodes),
      })}
    />
  )
}
