import type { ReactNode } from 'react'
import { useSession } from '../../data/session.ts'
import { LoginPanelContainer } from './LoginPanelContainer'

/** Renders the page for a signed-in user, and the login panel in its place (at the same URL) for anyone else. */
export const RequireSession = ({ children }: { children: ReactNode }) =>
  useSession() === 'yes' ? <>{children}</> : <LoginPanelContainer />
