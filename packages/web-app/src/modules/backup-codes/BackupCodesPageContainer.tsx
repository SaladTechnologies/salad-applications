import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { BackupCodesPage } from './components'

const mockedGeneratedBackupCodes = [
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
  '21JKH-LJLK1',
]

const mapStoreToProps = (store: RootStore): any => ({
  backupCodes: mockedGeneratedBackupCodes,
  onBackToProfileClick: () => store.routing.push(`/account/summary`),
  onGenerateNewBackupCodesClick: () => {},
})

export const BackupCodesPageContainer = connect(mapStoreToProps, BackupCodesPage)
