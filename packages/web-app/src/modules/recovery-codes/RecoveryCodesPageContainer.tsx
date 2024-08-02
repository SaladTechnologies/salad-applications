import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { RecoveryCodesPage } from './components'

const mockedGeneratedRecoveryCodes = [
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
  recoveryCodes: mockedGeneratedRecoveryCodes,
  onBackToProfileClick: () => store.routing.push(`/account/summary`),
  onGenerateNewRecoveryCodesClick: () => {},
})

export const RecoveryCodesPageContainer = connect(mapStoreToProps, RecoveryCodesPage)
