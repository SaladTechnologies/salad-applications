import { useQuery } from '@tanstack/react-query'

/** The query keys of the account security loads. */
const passkeysQueryKey = ['account', 'passkeys'] as const
const profileQueryKey = ['account', 'profile'] as const
const googleConnectionQueryKey = ['account', 'google-connection'] as const
const backupCodesQueryKey = ['account', 'backup-codes'] as const

/** Runs `load` each time a page that calls it opens. The data stays in the store; the query only schedules the load. */
const useLoadOnOpen = (queryKey: readonly string[], load: () => Promise<unknown>): void => {
  useQuery({
    queryKey,
    queryFn: async () => {
      await load()
      return null
    },
    staleTime: 0,
  })
}

/**
 * Runs `fetchPasskeys`, then `loadProfile`, each time an account summary page (desktop or mobile) opens, as its account
 * security section did. The passkeys and the profile stay in their stores, which the pages read. Both loads handle
 * their own errors.
 */
export const useAccountSecurityLoads = (
  fetchPasskeys: () => Promise<unknown>,
  loadProfile: () => Promise<unknown>,
): void => {
  useLoadOnOpen(passkeysQueryKey, fetchPasskeys)
  useLoadOnOpen(profileQueryKey, loadProfile)
}

/**
 * Runs `load` (the profile store's load of the connected Google account, which first reads the external login result
 * from the query string and replaces the URL with `/account/summary`) each time the desktop account summary opens, as
 * the page did. `load` handles its own errors.
 */
export const useGoogleConnectionLoad = (load: () => Promise<unknown>): void => {
  useLoadOnOpen(googleConnectionQueryKey, load)
}

/**
 * Runs `load` (the backup codes store's load of the codes) each time the backup codes page opens, as the page did. The
 * codes stay in the store, which the page reads. `load` handles its own errors.
 */
export const useBackupCodesLoad = (load: () => Promise<unknown>): void => {
  useLoadOnOpen(backupCodesQueryKey, load)
}
