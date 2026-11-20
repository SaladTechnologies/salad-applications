import type { ReactNode } from 'react'
import MediaQueryImport from 'react-responsive'
import { cjsDefault } from '../cjs-default.ts'

const MediaQuery = cjsDefault(MediaQueryImport)

interface Props {
  orientation?: 'portrait' | 'landscape'
  children?: ReactNode
}

export const mobileSize = 812

export const MobileDevice = ({ orientation, children }: Props) => (
  <MediaQuery maxWidth={mobileSize} orientation={orientation}>
    {children}
  </MediaQuery>
)

export const NotMobile = ({ children }: Props) => <MediaQuery minWidth={mobileSize + 1}>{children}</MediaQuery>

/** Renders `mobile` on a phone-sized screen and `desktop` otherwise, deciding again as the window resizes. */
export const ByDevice = ({ desktop, mobile }: { desktop: ReactNode; mobile: ReactNode }) => (
  <>
    <MobileDevice>{mobile}</MobileDevice>
    <NotMobile>{desktop}</NotMobile>
  </>
)
